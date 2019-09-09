// const path = require('path');
// const { DefinePlugin } = require('webpack');
const aggregateTranslations = require('terra-aggregate-translations');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const ThemeAggregator = require('../../../scripts/aggregate-themes/theme-aggregator');
const getThemeWebpackPromise = require('../getThemeWebpackPromise');
/**
 * Generate a terra-dev-site
 */
class TerraWebpack {
  constructor({ aggregateOptions, disableHotReloading = false }) {
    this.disableHotReloading = disableHotReloading;
    this.aggregateOptions = aggregateOptions;
  }

  apply(compiler) {
    const themeFile = ThemeAggregator.aggregate();

    const processPath = process.cwd();
    /* Get the root path of a mono-repo process call */
    const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;
    if (!this.aggregateOptions.disable) {
      aggregateTranslations({ baseDir: this.rootPath, ...this.aggregateOptions });
      compiler.options.resolve.modules.unshift('aggregated-translations');
    }

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
  }
}

module.exports = TerraWebpack;
