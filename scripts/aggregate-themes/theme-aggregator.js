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
const LOG_CONTEXT = '[terra-theme-aggregator]';

/**
 * Aggregates and generates theme assets.
 * Aggregates the above assets into a single file.
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
      if (assets) return ThemeAggregator.writeJsFile(assets);
    }

    return null;
  }

  /**
   * Aggregates theme assets into a js file.
   * @param {Object} options - The aggregation options.
   * @returns {array} - An array of aggregated theme files
   */
  static aggregateThemes(options) {
    if (!ThemeAggregator.validate(options)) return null;

    fs.ensureDir(OUTPUT_DIR, (err) => {
      Logger.warn(err, { LOG_CONTEXT });
    });

    const {
      theme: defaultTheme,
      scoped,
    } = options;

    // This flag guards against default theme and scope theme being equivalent.
    let defaultFlag = false;
    if (defaultTheme) defaultFlag = true;

    let themesToAggregate = defaultTheme ? [defaultTheme] : [];
    if (scoped) themesToAggregate = themesToAggregate.concat(scoped);

    const assets = [];
    themesToAggregate.forEach((theme) => {
      const asset = ThemeAggregator.triggerAggregationAndGeneration(theme, options, defaultFlag);
      if (asset) assets.push(...asset);

      // There can only be one instance of the default theme. This stops multiple root themes from being generated.
      if (defaultFlag) defaultFlag = false;
    });

    if (!assets.length) return null;
    return assets;
  }

  /**
   * Triggers aggregation and generation for a given theme.
   * @param {string} themeName - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @param {boolean} defaultFlag - Whether the theme to be generated is a root or scope theme. Guards against default theme and scope theme being equivalent.
   * @returns {array} - An array of file names.
   */
  static triggerAggregationAndGeneration(themeName, options = {}, defaultFlag) {
    if (!themeName) return null;
    Logger.log(`Aggregating ${themeName} files...`, { LOG_CONTEXT });
    const { theme, scoped = [] } = options;
    const isRoot = themeName === theme && defaultFlag;
    const isScoped = scoped.indexOf(themeName) > -1;
    const themeScope = { isRoot, isScoped };

    const aggregatedAssets = ThemeAggregator.aggregateTheme(themeName, themeScope, options);
    const generatedAsset = ThemeAggregator.generateTheme(themeName, themeScope, options);
    // Generated theme file should take precedence over aggregated files.
    // Therefore, take advantage of css import precdence by adding the generated asset last.
    if (generatedAsset) aggregatedAssets.push(generatedAsset);

    if (!aggregatedAssets.length) {
      Logger.warn(`No theme files found for ${themeName}.`, { LOG_CONTEXT });
      return null;
    }

    return aggregatedAssets;
  }

  /**
   * Aggregates the theme by root.scss or scoped.scss file
   * @param {string} themeName - The theme to aggregate.
   * @param {Object} themeScope - Contains boolean attributes that signify whether the theme to aggregate is a root (isRoot) or scoped (isScoped) file.
   * @param {Object} options - The aggregate options.
   * @returns {array} - An array of aggregated theme files.
   */
  static aggregateTheme(themeName, themeScope, options) {
    const file = themeScope.isScoped && !themeScope.isRoot ? SCOPED_THEME : ROOT_THEME;
    const assets = ThemeAggregator.find(`**/themes/${themeName}/${file}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${themeName}/**/${file}`, options));
    // Resolve aggregated theme paths.
    return assets.map(asset => ThemeAggregator.resolve(asset));
  }

  /**
   * Writes a scss theme file based on generation filename constraints.
   * @TODO Default to theme generation on next MVB - https://github.com/cerner/terra-toolkit/issues/325
   * @param {string} themeName - The theme to aggregate.
   * @param {Object} themeScope - Contains boolean attributes that signify whether the theme to aggregate is a root (isRoot) or scoped (isScoped) file.
   * @param {Object} options - The aggregate options.
   * @param {string} outputPath - Path to write the scss file to. Used for testing purposes - overrides the default generated themes path.
   * @returns {string} - A string containing the relative path to the generacted scss file.
   */
  static generateTheme(themeName, themeScope, options, outputPath) {
    const { isRoot, isScoped } = themeScope;
    const assets = ThemeAggregator.findThemeVariableFilesForGeneration(themeName, options);
    if (!assets) return null;

    const prefix = isScoped && !isRoot ? SCOPED : ROOT;
    const scopeSelector = isScoped && !isRoot ? `.${themeName}` : `:${ROOT}`;
    let file = assets.reduce((acc, s) => `${acc}  @import '../${s}';\n`, '');
    const intro = `${DISCLAIMER}${scopeSelector}`;
    file = `${intro} {\n${file}}\n`;

    const fileName = `${prefix}-${themeName}.scss`;
    const filePath = path.resolve(outputPath || OUTPUT_PATH, fileName);
    fs.writeFileSync(filePath, file);
    Logger.log(`Successfully generated ${fileName}.`, { LOG_CONTEXT });

    return `./${path.relative(outputPath || OUTPUT_PATH, filePath)}`;
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
      Logger.warn('No theme provided.', { LOG_CONTEXT });
      return false;
    }

    return true;
  }

  /**
   * Searches for theme files located within the following directory format: themes->theme-name->theme-name.scss.
   * @param {string} themeName - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @returns {array} - An array of ${themeName} files.
   */
  static findThemeVariableFilesForGeneration(themeName, options = {}) {
    const assets = ThemeAggregator.find(`**/themes/${themeName}/**/${themeName}.scss`, options);
    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${themeName}/**/${themeName}.scss`, options));

    if (!assets.length) return null;

    return assets;
  }

  /**
   * Writes a js file containing theme assets.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeJsFile(imports) {
    if (!imports.length) {
      Logger.warn(`No themes to import. Skip generating ${OUTPUT}.`, { LOG_CONTEXT });
      return null;
    }

    const file = imports.reduce((acc, s) => `${acc}import '${s}';\n`, '');
    const filePath = `${path.resolve(OUTPUT_PATH, OUTPUT)}`;
    fs.writeFileSync(filePath, `${DISCLAIMER}${file}`);

    Logger.log(`Successfully generated ${OUTPUT}.`, { LOG_CONTEXT });
    return filePath;
  }
}

module.exports = ThemeAggregator;
