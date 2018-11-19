const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const rtl = require('postcss-rtl');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const browserslist = require('browserslist-config-terra');
const merge = require('webpack-merge');
const aggregateTranslations = require('../../scripts/aggregate-translations/aggregate-translations');

const webpackConfig = (options, env, argv) => {
  const { rootPath, resolveModules } = options;

  const production = argv.p;
  let filename = production ? '[name]-[chunkhash]' : '[name]';
  filename = argv['output-filename'] || filename;
  const outputPath = argv['output-path'] || path.join(rootPath, 'build');
  const publicPath = argv['output-public-path'] || '';

  const devConfig = {
    mode: 'development',
    entry: {
      raf: 'raf/polyfill',
      'babel-polyfill': 'babel-polyfill',
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                minimize: false, // Issue logged: https://github.com/cerner/terra-toolkit/issues/122
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // Add unique ident to prevent the loader from searching for a postcss.config file. Additionally see: https://github.com/postcss/postcss-loader#plugins
                ident: 'postcss',
                plugins() {
                  return [
                    rtl(),
                    Autoprefixer({ browsers: browserslist }),
                  ];
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.md$/,
          use: 'raw-loader',
        },
        {
          test: /\.(png|svg|jpg|gif|otf|eot|ttf|svg|woff|woff2)$/,
          use: 'file-loader',
        }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${filename}.css`,
      }),
      new PostCSSAssetsPlugin({
        test: /\.css$/,
        log: false,
        plugins: [
          PostCSSCustomProperties({ preserve: true }),
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: resolveModules,
      // See https://github.com/facebook/react/issues/8026
      alias: {
        react: path.resolve(rootPath, 'node_modules', 'react'),
        'react-intl': path.resolve(rootPath, 'node_modules', 'react-intl'),
        'react-dom': path.resolve(rootPath, 'node_modules', 'react-dom'),
      },
    },
    output: {
      filename: `${filename}.js`,
      path: outputPath,
      publicPath,
    },
    devtool: 'cheap-source-map',
    resolveLoader: {
      modules: [path.resolve(path.join(rootPath, 'node_modules'))],
    },
    stats: { children: false },
  };

  if (!production) {
    return devConfig;
  }

  return merge.strategy({
    devtool: 'replace',
  })(devConfig, {
    mode: 'production',
    devtool: false,
    plugins: [
      new CleanPlugin(outputPath, { root: rootPath, exclude: ['stats.json'] }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            compress: {
              typeofs: false,
            },
          },
        }),
      ],
    },
  });
};

const defaultWebpackConfig = (env = {}, argv = {}) => {
  const disableAggregateTranslations = env.disableAggregateTranslations;

  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  const resolveModules = ['node_modules'];
  if (!disableAggregateTranslations) {
    aggregateTranslations(Object.assign({}, { baseDirectory: rootPath }, env.aggregateOptions));
    resolveModules.unshift(path.resolve(rootPath, 'aggregated-translations'));
  }

  const options = { rootPath, resolveModules };

  return webpackConfig(options, env, argv);
};

module.exports = defaultWebpackConfig;
