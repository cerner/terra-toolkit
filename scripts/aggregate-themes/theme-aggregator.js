const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Logger = require('../utils/logger');

const CONFIG = 'terra-theme.config.js';
const DISCLAIMER = fs.readFileSync(path.resolve(__dirname, 'disclaimer.txt'), 'utf8');
const NODE_MODULES = 'node_modules/';
const OUTPUT = 'aggregated-themes.js';
const OUTPUT_DIR = 'generatedThemes';
const OUTPUT_PATH = path.resolve(process.cwd(), OUTPUT_DIR);
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

    return null;
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

    const file = scoped.indexOf(theme) > -1 ? SCOPED_THEME : ROOT_THEME; // TODO Remove scope logic on next version bump.
    const assets = ThemeAggregator.find(`**/themes/${theme}/${file}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${theme}/**/${file}`, options));

    if (assets.length === 0) {
      Logger.warn(`No theme files found for ${theme}.`);
    }

    return assets.map(asset => ThemeAggregator.resolve(asset));
  }

  /**
   * Aggregates theme assets and generates a scope theme.
   * @param {string} theme - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @returns {string} - The relative file path of the generated scope theme
   */
  static generateScopedTheme(theme, options = {}) {
    const { name } = theme;

    Logger.log(`Generating scoped file for ${name}...`);

    const assets = ThemeAggregator.find(`**/themes/${name}/${ROOT_THEME}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${name}/**/${ROOT_THEME}`, options));

    if (assets.length === 0) {
      Logger.warn(`No theme files found for ${name}.`);
      return null;
    }

    return ThemeAggregator.writeScopedThemeFile(assets, theme);
  }

  /**
   * Aggregates theme assets into a single file.
   * @param {Object} options - The aggregation options.
   * @returns {string} - The output path of the aggregated theme file.
   */
  static aggregateThemes(options) {
    if (!ThemeAggregator.validate(options)) {
      return null;
    } else {
      fs.mkdir(OUTPUT_DIR, (error) => {
        Logger.log(`Error creating generatedThemes directory: ${error}`);
      });
    }

    const assets = [];
    const { theme, scoped = [], generateScoped = false } = options; // TODO Remove opt in generateScoped config on next MVB

    // Aggregate the default theme.
    if (theme) {
      assets.push(...ThemeAggregator.aggregateTheme(theme, options));
    }

    // Aggregate the scoped themes.
    if (generateScoped) {
      scoped.forEach((scopedTheme) => {
        assets.push(ThemeAggregator.generateScopedTheme(scopedTheme, options));
      });
    } else {
      scoped.forEach((scopedTheme) => {
        assets.push(ThemeAggregator.aggregateTheme(scopedTheme, options));
      });
    }

    return ThemeAggregator.writeFile(assets);
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
    return `./${path.relative(outputPath, path.resolve(process.cwd(), filePath))}`;
  }

  /**
   * Validates the aggregated options.
   * @param {Object} options - The aggregated options.
   */
  static validate(options) {
    const { theme, scoped } = options;

    if (!theme && !scoped) {
      Logger.warn('No theme provided.');
      return false;
    }

    return true;
  }

  /**
   * Writes a file containing scoped theme imports.
   * @param {string} assets - The theme to aggregate.
   * @param {Object} theme - The object containing theme nanme and scope selector.
   * @returns {string} - The scoped theme file name.
   */
  static writeScopedThemeFile(assets, theme) {
    const { name, scopeSelector = name } = theme;
    const fileName = `scoped-${name}.scss`;
    const filePath = `${path.resolve(OUTPUT_PATH, fileName)}`;

    let file = assets.reduce((acc, s) => `${acc}  @import '${s}';\n`, '');
    file = `${DISCLAIMER}.${scopeSelector} {\n${file}}\n`;

    fs.writeFileSync(filePath, file);

    Logger.log(`Successfully generated ${fileName}.`);
    console.log(`filePath: ${filePath}`);
    return `./${filename}`;
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
module.exports = ThemeAggregator;
