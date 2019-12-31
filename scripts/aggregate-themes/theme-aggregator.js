const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const Logger = require('../utils/logger');

const CONFIG = 'terra-theme.config.js';
const DISCLAIMER = fs.readFileSync(path.resolve(__dirname, 'disclaimer.txt'), 'utf8');
const NODE_MODULES = 'node_modules/';
const OUTPUT = 'aggregated-themes.js';
const OUTPUT_DIR = 'generated-themes';
const OUTPUT_PATH = path.resolve(process.cwd(), OUTPUT_DIR);
const ROOT = 'root';
const SCOPED = 'scoped';
const ROOT_THEME = `${ROOT}-theme.scss`;
const SCOPED_THEME = `${SCOPED}-theme.scss`;
const context = '[terra-theme-aggregator]';

/**
 * Aggregates theme assets into a single file.
 *
 * By default the theme will recursively search all dependencies.
 */
class ThemeAggregator {
  /**
   * Aggregates theme assets.
   * @param {string} theme - The theme to override the default theme. Used for visual regression testing.
   * @returns {string|null} - The output path of the aggregated theme file. Null if not generated.
   */
  static aggregate(theme) {
    let themeConfig;
    const defaultConfig = path.resolve(process.cwd(), CONFIG);
    if (fs.existsSync(defaultConfig)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      themeConfig = require(defaultConfig);
      const assets = ThemeAggregator.aggregateThemes({ ...themeConfig, ...theme && { theme } });
      if (assets) {
        return ThemeAggregator.writeJsFile(assets);
      }
    }
    return null;
  }

  /**
   * Aggregates theme assets.
   * @param {string} theme - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @param {boolean} defaultFlag - Whether the theme to be generated is a root or scope theme. Guards against default theme and scope theme being equivalent.
   * @returns {array} - An array of file names.
   */
  static aggregateTheme(themeName, options = {}, defaultFlag) {
    const { theme, scoped = [] } = options;

    if (!themeName) return null;

    Logger.log(`Aggregating ${themeName}...`, { context });
    const isRoot = themeName === theme && defaultFlag;
    const isScoped = scoped.indexOf(themeName) > -1;
    const file = isScoped && !isRoot ? SCOPED_THEME : ROOT_THEME;
    const assets = ThemeAggregator.find(`**/themes/${themeName}/${file}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${themeName}/**/${file}`, options));

    assets.map(asset => ThemeAggregator.resolve(asset));

    // Theme Generation.
    // @TODO Default to theme generation on next MVB - https://github.com/cerner/terra-toolkit/issues/325
    const prefix = isScoped && !isRoot ? SCOPED : ROOT;
    const scopeSelector = isScoped && !isRoot ? `.${themeName}` : `:${ROOT}`;
    const themeFiles = ThemeAggregator.findThemeVariableFiles(themeName, options);
    const fileAttrs = {
      assets: themeFiles,
      themeName,
      prefix,
      scopeSelector,
    };

    if (themeFiles) assets.push(ThemeAggregator.writeSCSSFile(fileAttrs));

    if (!assets.length) {
      Logger.warn(`No theme files found for ${themeName}.`, { context });
      return null;
    }

    return assets;
  }

  /**
   * Aggregates theme files for generation.
   * @param {string} themeName - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @returns {array} - An array of ${themeName} files.
   */
  static findThemeVariableFiles(themeName, options = {}) {
    const assets = ThemeAggregator.find(`**/themes/${themeName}/**/${themeName}.scss`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${themeName}/**/${themeName}.scss`, options));

    if (!assets.length) {
      Logger.warn(`No theme files found for ${themeName}.`, { context });
      return null;
    }

    return assets;
  }

  /**
   * Aggregates theme assets into a js file.
   * @param {Object} options - The aggregation options.
   * @returns {array} - An array of aggregated theme files
   */
  static aggregateThemes(options) {
    if (!ThemeAggregator.validate(options)) return null;

    // Create generated-themes directory.
    fs.ensureDir(OUTPUT_DIR, (err) => {
      Logger.warn(err, { context });
    });

    const {
      theme: defaultTheme,
      scoped,
    } = options;

    // Guards against default theme and scope theme being equivalent.
    let defaultFlag = false;
    if (defaultTheme) defaultFlag = true;

    let themesToAggregate = defaultTheme ? [defaultTheme] : [];
    if (scoped) themesToAggregate = themesToAggregate.concat(scoped);

    const assets = [];
    let asset;
    themesToAggregate.forEach((theme) => {
      asset = ThemeAggregator.aggregateTheme(theme, options, defaultFlag);
      if (asset) assets.push(...asset);
      if (defaultFlag) defaultFlag = false; // There can only be one instance of the default theme. This stops multiple root themes from being generated.
    });

    if (!assets.length) return null;

    return assets;
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

    return `../${relativePath}`;
  }

  /**
   * Validates the aggregated options.
   * @param {Object} options - The aggregated options.
   * @returns {boolean} - Whether the theme config has valid options.
   */
  static validate(options) {
    const { theme, scoped } = options;

    if (!theme && !scoped) {
      Logger.warn('No theme provided.', { context });
      return false;
    }

    return true;
  }

  /**
   * Generates a theme scss file and outputs it to the generated-themes directory.
   * @param {object} contains requested scss file attrs
   *   @param {array} assets - The aggregated theme files to import within generated file.
   *   @param {string} themeName - Name of theme to aggregate.
   *   @param {string} prefix - Prefix to append to generated file.
   *   @param {string} scopeSelector - scss scope selector to encase theme.
   *   @param {string} outputPath - path to write the scss file to. For testing purposes - overrides the default generated-themes path.
   * @returns {string} - The path of the generated scss file, relative to the working home directory.
   */
  static writeSCSSFile({
    assets, themeName, prefix, scopeSelector, outputPath,
  }) {
    const fileName = `${prefix}-${themeName}.scss`;
    const intro = `${DISCLAIMER}${scopeSelector}`;

    let file = assets.reduce((acc, s) => `${acc}  @import '../${s}';\n`, '');
    file = `${intro} {\n${file}}\n`;

    const filePath = path.resolve(outputPath || OUTPUT_PATH, fileName);
    fs.writeFileSync(filePath, file);
    Logger.log(`Successfully generated ${fileName}.`, { context });

    return [`./${path.relative(outputPath || OUTPUT_PATH, filePath)}`];
  }

  /**
   * Writes a js file containing theme assets.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeJsFile(imports) {
    if (!imports.length) {
      Logger.warn(`No themes to import. Skip generating ${OUTPUT}.`, { context });
      return null;
    }

    const filePath = `${path.resolve(OUTPUT_PATH, OUTPUT)}`;
    const file = imports.reduce((acc, s) => `${acc}import '${s}';\n`, '');
    fs.writeFileSync(filePath, `${DISCLAIMER}${file}`);

    Logger.log(`Successfully generated ${OUTPUT}.`, { context });
    return filePath;
  }
}

module.exports = ThemeAggregator;
