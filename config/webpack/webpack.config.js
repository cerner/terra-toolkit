const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const rtl = require('postcss-rtl');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin');
const aggregateTranslations = require('terra-aggregate-translations');
const ThemeAggregator = require('../../scripts/aggregate-themes/theme-aggregator');

const webpackConfig = (options, env, argv) => {
  const {
    rootPath,
    resolveModules,
    themeFile,
    staticOptions,
  } = options;

  const production = argv.p;
  let filename = production ? '[name]-[chunkhash]' : '[name]';
  filename = argv['output-filename'] || filename;
  const outputPath = argv['output-path'] || path.join(rootPath, 'build');
  const publicPath = argv['output-public-path'] || '';

  const devConfig = {
    mode: 'development',
    entry: {
      raf: 'raf/polyfill',
      'core-js': 'core-js/stable',
      'regenerator-runtime': 'regenerator-runtime/runtime',
      ...themeFile && { theme: themeFile },
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward', // needed to correctly resolve babel's config root in mono-repos
            },
          },
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !production, // only enable hot module reloading in development
                sourceMap: true,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: 'global',
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // Add unique ident to prevent the loader from searching for a postcss.config file. See: https://github.com/postcss/postcss-loader#plugins
                ident: 'postcss',
                sourceMap: true,
                plugins() {
                  return [
                    rtl(),
                    Autoprefixer(),
                  ];
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
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
        ignoreOrder: true,
      }),
      new PostCSSAssetsPlugin({
        test: /\.css$/,
        log: false,
        plugins: [
          PostCSSCustomProperties({ preserve: true }),
        ],
      }),
      new DuplicatePackageCheckerPlugin({
        showHelp: false,
        alwaysEmitErrorsFor: [
          'react',
          'react-dom',
          'react-intl',
          'react-on-rails',
          'terra-breakpoints',
          'terra-application',
          'terra-disclosure-manager',
          'terra-navigation-prompt',
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: resolveModules,
    },
    output: {
      filename: `${filename}.js`,
      path: outputPath,
      publicPath,
    },
    devServer: {
      ...staticOptions,
      host: '0.0.0.0',
      publicPath,
      stats: {
        colors: true,
        children: false,
      },
    },
    devtool: 'eval-source-map',
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
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'] }),
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
  const {
    disableAggregateTranslations, disableHotReloading, terraThemeConfig, theme,
  } = env;

  const staticOptions = {
    ...disableHotReloading && {
      hot: false,
      inline: false,
    },
  };

  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  const resolveModules = ['node_modules'];
  if (!disableAggregateTranslations) {
    aggregateTranslations(Object.assign({}, { baseDir: rootPath }, env.aggregateOptions));
    resolveModules.unshift(path.resolve(rootPath, 'aggregated-translations'));
  }

  const themeFile = ThemeAggregator.aggregate(terraThemeConfig, theme);

  const options = {
    rootPath,
    resolveModules,
    themeFile,
    staticOptions,
  };

  return webpackConfig(options, env, argv);
};

module.exports = defaultWebpackConfig;
