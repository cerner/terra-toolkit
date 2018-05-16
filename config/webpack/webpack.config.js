const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const rtl = require('postcss-rtl');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const aggregateTranslations = require('../../scripts/aggregate-translations/aggregate-translations');
const merge = require('webpack-merge');

const defaultWebpackConfig = (env = {}, argv = {}) => {
  const production = argv.p;
  const disableAggregateTranslations = env.disableAggregateTranslations;
  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  const resolveModules = ['node_modules'];
  if (!disableAggregateTranslations) {
    aggregateTranslations(Object.assign({}, { baseDirectory: rootPath }, env.aggregateOptions));
    resolveModules.unshift(path.resolve(rootPath, 'aggregated-translations'));
  }

  const devConfig = {
    entry: {
      raf: 'raf/polyfill',
      'babel-polyfill': 'babel-polyfill',
    },
    module: {
      rules: [{
        test: /\.(jsx|js)$/,
        exclude: /node_modules(?!\/terra-dev-site\/src)/,
        use: 'babel-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader',
            options: {
              // Add unique ident to prevent the loader from searching for a postcss.config file. Additionally see: https://github.com/postcss/postcss-loader#plugins
              ident: 'postcss',
              plugins() {
                return [
                  Autoprefixer({
                    browsers: [
                      'ie >= 10',
                      'last 2 versions',
                      'last 2 android versions',
                      'last 2 and_chr versions',
                      'iOS >= 10',
                    ],
                  }),
                  rtl(),
                ];
              },
            },
          }, {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader',
      }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
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
      path: path.join(rootPath, 'build'),
    },
    devtool: production ? undefined : 'cheap-module-eval-source-map',
    resolveLoader: {
      modules: [path.resolve(path.join(rootPath, 'node_modules'))],
    },
    mode: 'development',
    stats: { children: false },
  };

  if (!production) {
    return devConfig;
  }

  const prodConfig = merge(devConfig, {
    output: {
      path: path.resolve('build'),
      filename: '[name]-[hash].js',
    },
    mode: 'production',
    devtool: undefined,
    plugins: [new CleanPlugin('build', { root: rootPath, exclude: ['stats.json'] })],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
    },
  });

  return prodConfig;
};

module.exports = defaultWebpackConfig;
