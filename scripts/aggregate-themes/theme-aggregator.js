const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const Logger = require('../utils/logger');

const CONFIG = 'terra-theme.config.js';
const DISCLAIMER = fs.readFileSync(path.resolve(__dirname, 'disclaimer.txt'), 'utf8');
const NODE_MODULES = 'node_modules/';
const OUTPUT = 'aggregated-themes.js';
const OUTPUT_DIR = 'generatedThemes';
const OUTPUT_PATH = path.resolve(process.cwd(), OUTPUT_DIR);
const ROOT = 'root';
const SCOPED = 'scoped';
const ROOT_THEME = `${ROOT}-theme.scss`;
const SCOPED_THEME = `${SCOPED}-theme.scss`;

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
  static aggregate(themeOverride) {
    // Component test usage.
    // Aggregates themeOverride only. Used to override default theme.
    if (themeOverride) {
      const configOverride = { theme: themeOverride, generateRoot: true };
      return ThemeAggregator.aggregateThemes(configOverride);
    }

    // Consumer usage.
    // Existing theme config takes precedence over passed in config
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
    const { scoped = [] } = options;

    const isScoped = scoped.indexOf(theme) > -1;
    const file = isScoped ? SCOPED_THEME : ROOT_THEME;
    const assets = ThemeAggregator.find(`**/themes/${theme}/${file}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${theme}/**/${file}`, options));

    if (!assets.length) {
      // If root or scope theme files not found, fallback to theme generation.
      // TODO: Make this the default functionality on next MVB.
      // Root Generation
      const prefix = !isScoped ? ROOT : SCOPED;
      const scopeSelector = !isScoped ? `:${ROOT}` : `.${theme}`;
      const themeFiles = ThemeAggregator.findThemeVariableFiles(theme, options);
      const fileAttrs = {
        assets: themeFiles,
        themeName: theme,
        prefix,
        scopeSelector,
      };
      let asset;

      if (themeFiles) {
        asset = ThemeAggregator.writeSCSSFile(fileAttrs);
        return asset;
      }

      if (theme.name) {
        Logger.warn(`No theme files found for ${theme.name}.`);
        return null;
      }

      Logger.warn(`No theme files found for ${theme}.`);
      return null;
    }

    Logger.log(`Aggregating ${theme}...`);
    return assets.map(asset => ThemeAggregator.resolve(asset));
  }

  /**
   * Aggregates theme files for generation.
   * @param {string} themeName - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @returns {array} - An array of *theme-variable files.
   */
  static findThemeVariableFiles(themeName, options = {}) {
    const assets = ThemeAggregator.find(`**/themes/${themeName}/**/${themeName}.scss`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${themeName}/**/${themeName}.scss`, options));

    if (!assets.length) {
      Logger.warn(`No theme files found for ${themeName}.`);
      return null;
    }

    return assets;
  }

  /**
   * Aggregates theme assets into a js file.
   * @param {Object} options - The aggregation options.
   * @returns {string} - The file path of the generated js file.
   */
  static aggregateThemes(options) {
    if (!ThemeAggregator.validate(options)) {
      return null;
    }

    const assets = [];
    let asset;
    const {
      theme, scoped,
    } = options;

    // Create generatedThemes directory.
    fs.ensureDir(OUTPUT_DIR, (err) => {
      Logger.warn(err);
    });

    if (theme) {
      asset = ThemeAggregator.aggregateTheme(theme, options);
      if (asset) {
        assets.push(...asset);
      }
    }

    if (scoped) {
      scoped.forEach((scopedTheme) => {
        asset = ThemeAggregator.aggregateTheme(scopedTheme, options);
        if (asset) {
          assets.push(asset);
        }
      });
    }

    return ThemeAggregator.writeJsFile(assets);
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
   * @returns {string} - Resolved file path relative to the home directory or node module path.
   */
  static resolve(filePath) {
    // Constructs the relative path.
    const relativePath = path.relative(OUTPUT_PATH, path.resolve(OUTPUT_PATH, filePath));
    if (filePath.indexOf(NODE_MODULES) > -1) {
      const dependencyPath = filePath.substring(filePath.indexOf(NODE_MODULES) + NODE_MODULES.length);
      return dependencyPath;
    }

    return relativePath;
  }

  /**
   * Validates the aggregated options.
   * @param {Object} options - The aggregated options.
   * @returns {boolean} - Whether the theme config has valid options.
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
   * Generates a theme scss file and outputs it to the generatedThemes directory.
   * @param {object} contains requested scss file attrs
   *   @param {string} assets - The aggregated theme files to import within generated file.
   *   @param {string} themeName - Name of theme to aggregate.
   *   @param {string} prefix - Prefix to append to generated file.
   *   @param {string} scopeSelector - scss scope selector to encase theme.
   * @returns {string} - The path of the generated scss file, relative to the working home directory.
   */
  static writeSCSSFile({
    assets, themeName, prefix, scopeSelector,
  }) {
    const fileName = `${prefix}-${themeName}.scss`;
    const intro = `${DISCLAIMER}${scopeSelector}`;

    let file = assets.reduce((acc, s) => `${acc}  @import '../${s}';\n`, '');
    file = `${intro} {\n${file}}\n`;

    const filePath = path.resolve(OUTPUT_PATH, fileName);
    fs.writeFileSync(filePath, file);
    Logger.log(`Successfully generated ${fileName}.`);

    return `./${path.relative(OUTPUT_PATH, filePath)}`;
  }

  /**
   * Writes a js file containing theme assets.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeJsFile(imports) {
    if (!imports.length) {
      Logger.warn(`No themes to import. Skip generating ${OUTPUT}.`);
      return null;
    }

    const filePath = `${path.resolve(OUTPUT_PATH, OUTPUT)}`;
    const file = imports.reduce((acc, s) => `${acc}import '${s}';\n`, '');
    fs.writeFileSync(filePath, `${DISCLAIMER}${file}`);

    Logger.log(`Successfully generated ${OUTPUT}.`);
    return filePath;
  }
}

module.exports = ThemeAggregator;
