const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Logger = require('../utils/logger');

const CONFIG = 'terra-theme.config.js';
const DISCLAIMER = fs.readFileSync(path.resolve(__dirname, 'disclaimer.txt'), 'utf8');
const NODE_MODULES = 'node_modules/';
const JAVACRIPT_OUTPUT = 'aggregated-themes.js';
const CSS_OUTPUT = 'aggregated-themes.css';
const OUTPUT_PATH = path.resolve(process.cwd());
const ROOT_THEME = 'root-theme.scss';
const SCOPED_THEME = 'scoped-theme.scss';

/**
 * Aggregates theme assets into a single file.
 *
 * By default the theme will recursively search all dependencies.
 */
class ThemeAggregator {
  /**
   * Aggregates theme assets.
   * @returns {string|null} - The output path of the aggregated theme file. Null if not generated.
   */
  static aggregate() {
    const defaultConfig = path.resolve(process.cwd(), CONFIG);

    if (fs.existsSync(defaultConfig)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return ThemeAggregator.aggregateThemes(require(defaultConfig));
    }

    return {};
  }

  /**
   * Aggregates theme assets.
   * @param {string} theme - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @returns {array} - An array of file names.
   */
  static aggregateTheme(theme, options = {}) {
    Logger.log(`Aggregating ${theme}...`);

    const { scoped = [] } = options;

    const file = scoped.indexOf(theme) > -1 ? SCOPED_THEME : ROOT_THEME;
    const assets = ThemeAggregator.find(`**/themes/${theme}/${file}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${theme}/**/${file}`, options));

    if (assets.length === 0) {
      Logger.warn(`No theme files were found for ${theme}.`);
    }

    return assets.map(asset => ThemeAggregator.resolve(asset));
  }

  /**
   * Aggregates theme assets into a single file.
   * @param {Object} options - The aggregation options.
   * @returns {Object} - The output path of the aggregated theme javascript file and css file.
   */
  static aggregateThemes(options) {
    ThemeAggregator.validate(options);

    const assets = [];
    const { theme, scoped = [] } = options;

    // Aggregate the default theme.
    if (theme) {
      assets.push(...ThemeAggregator.aggregateTheme(theme, options));
    }

    // Aggregate the scoped themes.
    scoped.forEach((name) => {
      assets.push(...ThemeAggregator.aggregateTheme(name, options));
    });

    return {
      javascriptFile: ThemeAggregator.writeFile(assets),
      rootCSSFile: ThemeAggregator.createRootCSSFile(assets),
    };
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
   * @returns {Object} - A resolved file path containing a relative path and a node module relative path
   */
  static resolve(filePath) {
    // Constructs the relative path.
    const outputPath = path.resolve(process.cwd());
    const relativePath = `./${path.relative(outputPath, path.resolve(process.cwd(), filePath))}`;

    if (filePath.indexOf(NODE_MODULES) > -1) {
      return {
        relativePath,
        nodeModuleRelativePath: filePath.substring(filePath.indexOf(NODE_MODULES) + NODE_MODULES.length),
      };
    }
    return {
      relativePath,
      nodeModuleRelativePath: relativePath,
    };
  }

  /**
   * Validates the aggregated options.
   * @param {Object} options - The aggregated options.
   */
  static validate(options) {
    const { theme, scoped } = options;

    if (!theme && !scoped) {
      Logger.warn('No theme provided.');
    }
  }

  /**
   * Writes a file containing theme imports.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeFile(imports) {
    const file = imports.reduce((acc, s) => `${acc}import '${s.nodeModuleRelativePath}';\n`, '');
    const filePath = `${path.resolve(OUTPUT_PATH, JAVACRIPT_OUTPUT)}`;

    fs.writeFileSync(filePath, `${DISCLAIMER}${file}`);

    Logger.log(`Successfully generated ${JAVACRIPT_OUTPUT}.`);

    return filePath;
  }

  static createRootCSSFile(imports) {
    const filePath = `${path.resolve(OUTPUT_PATH, CSS_OUTPUT)}`;

    const sass = require('node-sass');
    const result = sass.renderSync({
      data: imports.reduce((acc, s) => `${acc}@import '${s.relativePath}';\n`, ''),
    });

    fs.writeFileSync(filePath, `${DISCLAIMER}${result.css.toString()}`);

    Logger.log(`Successfully generated ${CSS_OUTPUT}.`);

    return filePath;
  }
}

module.exports = ThemeAggregator;
