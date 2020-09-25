const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const rtl = require('postcss-rtl');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin');
const aggregateTranslations = require('terra-aggregate-translations');
const ThemePlugin = require('./lib/postcss/ThemePlugin');
const getThemeConfig = require('./lib/utils/_getThemeConfig');

const getLocales = ({ disableAggregateTranslations, rootPath }) => {
  if (!disableAggregateTranslations) {
    return aggregateTranslations({ baseDir: rootPath });
  }
  return undefined;
};

const getResolveModules = ({ disableAggregateTranslations }) => (
  [
    'node_modules',
    ...disableAggregateTranslations ? [] : ['aggregated-translations'],
  ]
);

const determineThemeConfig = ({ themeConfig: overrideThemeConfig }) => {
  const defaultTheme = process.env.THEME; // Flexes root theme for theme visual regression testing.

  if (defaultTheme) {
    return { theme: defaultTheme };
  }
  if (overrideThemeConfig) {
    return overrideThemeConfig;
  }

  return getThemeConfig();
};

const getWebpackDevServerStaticOptions = ({ disableHotReloading }) => (
  {
    ...disableHotReloading && {
      hot: false,
      inline: false,
    },
  }
);

const defaultWebpackConfig = (env = {}, argv = {}, options = {}) => {
  const {
    disableAggregateTranslations,
  } = env;

  const processPath = process.cwd();
  /* Get the root path of a mono-repo process call */
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  const resolveModules = getResolveModules(env);

  const locales = getLocales({
    disableAggregateTranslations,
    rootPath,
  });

  const themeConfig = determineThemeConfig(options);

  const production = argv.p;
  const fileNameStategy = production ? '[name]-[chunkhash]' : '[name]';
  const chunkFilename = argv['output-chunk-filename'] || fileNameStategy;
  const filename = argv['output-filename'] || fileNameStategy;
  const outputPath = argv['output-path'] || path.join(rootPath, 'build');
  const publicPath = argv['output-public-path'] || '';

  const devConfig = {
    mode: 'development',
    entry: {
      'core-js': 'core-js/stable',
      'regenerator-runtime': 'regenerator-runtime/runtime',
    },
    module: {
      rules: [{
        oneOf: [{
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
                modules: {
                  mode: 'global',
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
                sourceMap: true,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // Add unique ident to prevent the loader from searching for a postcss.config file. See: https://github.com/postcss/postcss-loader#plugins
                ident: 'postcss',
                sourceMap: true,
                plugins: [
                  ThemePlugin(themeConfig),
                  rtl(),
                  Autoprefixer(),
                ],
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
      }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${filename}.css`,
        chunkFilename: `${chunkFilename}.css`,
        ignoreOrder: true,
      }),
      new PostCSSAssetsPlugin({
        test: /\.css$/,
        log: false,
        plugins: [
          PostCSSCustomProperties({
            preserve: !env.disableCSSCustomProperties,
          }),
        ],
      }),
      new DuplicatePackageCheckerPlugin({
        showHelp: false,
        alwaysEmitErrorsFor: [
          'react',
          'react-dom',
          'react-intl',
          'react-on-rails',
          'terra-application',
          'terra-breakpoints',
          'terra-disclosure-manager',
          'terra-navigation-prompt',
          'terra-theme-context',
        ],
      }),
      new webpack.DefinePlugin({
        CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(Date.now()).toISOString()),
        TERRA_AGGREGATED_LOCALES: JSON.stringify(locales),
        TERRA_THEME_CONFIG: JSON.stringify(themeConfig),
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: resolveModules,
      mainFields: ['main'],
    },
    output: {
      filename: `${filename}.js`,
      chunkFilename: `${chunkFilename}.js`,
      path: outputPath,
      publicPath,
    },
    devServer: {
      ...getWebpackDevServerStaticOptions(env),
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

module.exports = defaultWebpackConfig;
