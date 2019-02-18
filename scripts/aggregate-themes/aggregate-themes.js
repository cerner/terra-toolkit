const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Logger = require('../utils/logger');

const CONFIG = 'theme.config.js';
const NODE_MODULES = 'node_modules/';
const OUTPUT = 'aggregated-themes.js';
const OUTPUT_PATH = path.resolve(process.cwd());
const DISCLAIMER = fs.readFileSync(path.resolve(__dirname, 'disclaimer.txt'), 'utf8');

/**
 * Aggregates theme assets into a single file.
 *
 * By default the theme will recursively search all dependencies.
 * If a theme directory contains a root-theme.scss only that single file will be aggregated.
 */
class ThemeAggregator {
  /**
   * Aggregates theme assets.
   * @returns {string} - The output path of the aggregated theme file.
   */
  static aggregate() {
    const defaultConfig = path.resolve(process.cwd(), CONFIG);

    if (fs.existsSync(defaultConfig)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return ThemeAggregator.aggregateTheme(require(defaultConfig));
    }

    return null;
  }

  /**
   * Aggregates theme assets.
   * @param {Object} options - The aggregation options.
   * @returns {string} - The output path of the aggregated theme file.
   */
  static aggregateTheme(options = {}) {
    ThemeAggregator.validate(options);

    const { theme } = options;

    const dirs = ThemeAggregator.find(`**/themes/${theme}/`, options);
    const assets = ThemeAggregator.filter(dirs, options);

    if (fs.existsSync(`${NODE_MODULES}${theme}/`)) {
      assets.unshift(theme);
    }

    return ThemeAggregator.writeFile(assets, options);
  }

  /**
   * Filters theme assets.
   * @param {string[]} patterns - An array of directory and file paths.
   * @param {Object} options - The aggregation options.
   * @returns {string[]} - An array of file names.
   */
  static filter(patterns, options) {
    const assets = [];
    patterns.forEach((asset) => {
      if (fs.lstatSync(asset).isDirectory()) {
        assets.push(...ThemeAggregator.filterDir(asset, options));
      } else {
        assets.push(asset);
      }
    });

    return assets.map(asset => ThemeAggregator.resolve(asset, options));
  }

  /**
   * Filters theme files within a directory.
   * @param {string} dir - The directory path.
   * @param {Object} options - The aggregation options.
   * @returns {string[]} - An array of filtered file names.
   */
  static filterDir(dir, options) {
    // Include only the root file if one exists and it is not excluded.
    const rootFile = ThemeAggregator.find(`${dir}root-theme.scss`, options);
    if (rootFile.length === 1) {
      return rootFile;
    }

    return ThemeAggregator.find(`${dir}*.scss`, options);
  }

  /**
   * Finds files and directories matching a pattern.
   * @param {string} pattern - A regex pattern.
   * @param {Object} options - The aggregation options.
   * @returns {string[]} - An array of matching files and directories.
   */
  static find(pattern, options) {
    const { exclude = [] } = options;

    return glob.sync(pattern, { ignore: exclude });
  }

  /**
   * Resolves a file path.
   * Dependency files will resolve to the node_modules directory.
   * Local files will resolve relative to the expected output directory.
   * @param {string} filePath - A file path.
   * @returns {string} - A resolved file path.
   */
  static resolve(filePath) {
    if (filePath.indexOf(NODE_MODULES) > -1) {
      return filePath.substring(filePath.indexOf(NODE_MODULES) + NODE_MODULES.length);
    }

    // Constructs the relative path.
    const outputPath = path.resolve(process.cwd());
    return path.relative(outputPath, path.resolve(process.cwd(), filePath));
  }

  /**
   * Validates the aggregated options.
   * @param {Object} options - The aggregated options.
   */
  static validate(options) {
    const { theme } = options;

    if (!theme) {
      Logger.warn('No theme provided.\nExiting process...');
      process.exit();
    }

    Logger.log(`Aggregating ${theme}...`);
  }

  /**
   * Writes a file containing theme imports.
   * @param {string[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeFile(imports) {
    const file = imports.reduce((acc, s) => `${acc}import '${s}';\n`, '');
    const filePath = `${path.resolve(OUTPUT_PATH, OUTPUT)}`;

    fs.writeFileSync(filePath, `${DISCLAIMER}${file}`);

    Logger.log(`Successfully generated ${OUTPUT}.`);

    return filePath;
  }
}

module.exports = ThemeAggregator.aggregate;
