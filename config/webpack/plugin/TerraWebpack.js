/* eslint-disable no-param-reassign */
const path = require('path');
// const { DefinePlugin } = require('webpack');
const aggregateTranslations = require('terra-aggregate-translations');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('@cerner/duplicate-package-checker-webpack-plugin');
const ThemeAggregator = require('../../../scripts/aggregate-themes/theme-aggregator');
const getThemeWebpackPromise = require('../getThemeWebpackPromise');

const applyIfEmpty = (property, newValue) => {
  if (property) {
    return;
  }
  property = newValue;
};
/**
 * Generate a terra-dev-site
 */
class TerraWebpack {
  constructor({ aggregateOptions, disableHotReloading = false }) {
    this.disableHotReloading = disableHotReloading;
    this.aggregateOptions = aggregateOptions;
  }

  apply(compiler) {
    const production = compiler.options.mode === 'production';
    const processPath = process.cwd();
    /* Get the root path of a mono-repo process call */
    const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

    const fileNameStategy = production ? '[name]-[chunkhash]' : '[name]';
    const chunkFilename = compiler.options.output.filename || fileNameStategy;
    const filename = compiler.options.output.filename || fileNameStategy;
    const outputPath = compiler.options.output.path || path.join(rootPath, 'build');
    const publicPath = compiler.options.output.publicPath || '';

    if (!this.aggregateOptions.disable) {
      aggregateTranslations({ baseDir: this.rootPath, ...this.aggregateOptions });
      compiler.options.resolve.modules.unshift('aggregated-translations');
    }

    const themeFile = ThemeAggregator.aggregate();

    // PLUGINS
    new MiniCssExtractPlugin({
      filename: `${filename}.css`,
      chunkFilename: `${chunkFilename}.css`,
      ignoreOrder: true,
    }).apply(compiler);
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      log: false,
      plugins: [
        PostCSSCustomProperties({
          preserve: true,
          // If we have a theme file, use the webpack promise to webpack it.  This promise will resolve to
          // an object with themeable variables and values. This will then be used to update the end state CSS
          // so that they are populated with values if variables aren't supported (e.g. IE10). This dance is
          // necessary when code splitting to ensure the variables and values are applied across all code split
          // css files
          ...themeFile && { importFrom: [getThemeWebpackPromise(rootPath, themeFile)] },
        }),
      ],
    }).apply(compiler);
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
    }).apply(compiler);

    if (production) {
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'] }).apply(compiler);
    }

    // RESOLVE

    // OUTPUT
    if (!compiler.options.output) {
      compiler.options.output = {};
    }
    applyIfEmpty(compiler.options.output, {});

    applyIfEmpty(compiler.options.output.filename, `${filename}.js`);
    applyIfEmpty(compiler.options.output.chunkFilename, `${chunkFilename}.js`);
    applyIfEmpty(compiler.options.output.path, outputPath);
    applyIfEmpty(compiler.options.output.publicPath, publicPath);

    // DEVSERVER
    if (!compiler.options.devServer) {
      compiler.options.devServer = {
        ...this.disableHotReloading && {
          hot: false,
          inline: false,
        },
        host: '0.0.0.0',
        publicPath,
        stats: {
          colors: true,
          children: false,
        },
      };
    }

    // DEVTOOL
    if (!production && !compiler.options.devtool) {
      compiler.options.devtool = 'eval-source-map';
    }
    // RESOLVELOADER
    compiler.options.resolveLoader = {
      modules: [path.resolve(rootPath, 'node_modules')],
    };
    // STATS
    compiler.options.stats.children = false;
  }
}

module.exports = TerraWebpack;
