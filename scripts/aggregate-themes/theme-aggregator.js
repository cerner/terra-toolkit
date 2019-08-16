const fs = require('fs');
const glob = require('glob');
const path = require('path');
const sass = require('node-sass');
const Logger = require('../utils/logger');

const CONFIG = 'terra-theme.config.js';
const DISCLAIMER = fs.readFileSync(path.resolve(__dirname, 'disclaimer.txt'), 'utf8');
const NODE_MODULES = 'node_modules/';
const JAVASCRIPT_OUTPUT = 'aggregated-themes.js';
const CSS_OUTPUT = 'aggregated-themes.css';
const OUTPUT_DIR = 'generatedThemes';
const OUTPUT_PATH = path.resolve(process.cwd(), OUTPUT_DIR);
const ROOT = 'root';
const SCOPED = 'scoped';
const ROOT_THEME = `${ROOT}-theme.scss`;
const SCOPED_THEME = `${SCOPED}-theme.scss`;
const THEME_VARIABLES = '*theme-variables.scss';

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
  static aggregate(config, themeOverride) {
    // Component repo test usage.
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

    // Dev site usage.
    // Passed in config allows dev site to display specified themes face up.
    if (config) {
      return ThemeAggregator.aggregateThemes(config);
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
   * Aggregates theme assets and generates a root or scope theme.
   * @param {string} theme - The theme to aggregate.
   * @param {Object} options - The aggregation options.
   * @param {string} isScoped - Signifies to generate a scoped theme.
   * @returns {string} - The relative file path of the generated theme.
   */
  static findThemeVariableFiles(theme, options = {}, isScoped) {
    let themeName;

    if (isScoped) {
      themeName = theme.name;
    } else {
      themeName = theme;
    }

    const assets = ThemeAggregator.find(`**/themes/${themeName}/${THEME_VARIABLES}`, options);

    // Add the dependency import if it exists.
    assets.unshift(...ThemeAggregator.find(`${NODE_MODULES}${themeName}/**/${THEME_VARIABLES}`, options));

    if (assets.length === 0) {
      Logger.warn(`No theme files found for ${themeName}.`);
      return null;
    }

    return assets;
  }

  /**
   * Creates a generatedThemes directory to place theme assets.
   */
  static createDirectory() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    } else {
      Logger.log(`Skip creating ${OUTPUT_DIR} directory - already exists.`);
    }
  }

  /**
   * Aggregates theme assets into a js and CSS file.
   * @param {Object} options - The aggregation options.
   * @returns {Object} - The output path of the aggregated theme js file and CSS file.
   */
  static aggregateThemes(options) {
    if (!ThemeAggregator.validate(options)) {
      return null;
    }

    const assets = [];
    let asset;
    const {
      theme, scoped, generateScoped = false, generateRoot = false,
    } = options; // TODO generateScoped and generateRoot on next MVB

    ThemeAggregator.createDirectory();

    // Aggregate the default theme.
    if (theme) {
      if (generateRoot) {
        const themeFiles = ThemeAggregator.findThemeVariableFiles(theme, options);
        if (themeFiles) { asset = ThemeAggregator.writeThemeFile(themeFiles, theme, false); }
        if (asset) { assets.push(asset); }
      } else {
        asset = ThemeAggregator.aggregateTheme(theme, options);
        if (asset) { assets.push(...asset); }
      }
    }

    // Aggregate the scoped themes.
    if (scoped) {
      if (generateScoped) {
        scoped.forEach((scopedTheme) => {
          const themeFiles = ThemeAggregator.findThemeVariableFiles(scopedTheme, options, true);
          if (themeFiles) { asset = ThemeAggregator.writeThemeFile(themeFiles, theme, true); }
          if (asset) { assets.push(asset); }
        });
      } else {
        scoped.forEach((scopedTheme) => {
          asset = ThemeAggregator.aggregateTheme(scopedTheme, options);
          if (asset) { assets.push(asset); }
        });
      }
    }

    return {
      javascriptFile: ThemeAggregator.writeJsThemeImportFile(assets),
      rootCSSFile: ThemeAggregator.writeRootCSSFile(assets),
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
    if (filePath.indexOf(NODE_MODULES) > -1) {
      const dependencyPath = filePath.substring(filePath.indexOf(NODE_MODULES) + NODE_MODULES.length);
      return {
        cssImportPath: dependencyPath,
        jsImportPath: dependencyPath,
      };
    }
    // Constructs the relative path.
    const relativePath = path.relative(OUTPUT_PATH, path.resolve(OUTPUT_PATH, filePath));

    return {
      cssImportPath: relativePath,
      jsImportPath: relativePath,
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
      return false;
    }

    return true;
  }

  /**
   * Writes a scss file containing either root or scoped theme imports.
   * @param {string} assets - The theme to aggregate.
   * @param {Object | string} theme - The object containing scoped theme name and scope selector, or string containing root theme name.
   * @returns {string} - The theme file relative to the generatedThemes directory.
   */
  static writeThemeFile(assets, theme, isScoped) {
    let fileName;
    let intro;

    if (isScoped) {
      const { name, scopeSelector = name } = theme;
      fileName = `${SCOPED}-${name}.scss`;
      intro = `${DISCLAIMER}.${scopeSelector}`;
    } else {
      fileName = `${ROOT}-${theme}.scss`;
      intro = `${DISCLAIMER}:${ROOT}`;
    }

    let file = assets.reduce((acc, s) => `${acc}  @import '../${s}';\n`, '');
    file = `${intro} {\n${file}}\n`;

    const filePath = path.resolve(OUTPUT_PATH, fileName);
    fs.writeFileSync(filePath, file);
    Logger.log(`Successfully generated ${fileName}.`);

    const cssImportPath = path.relative(process.cwd(), filePath);
    const jsImportPath = `./${path.relative(OUTPUT_PATH, filePath)}`;
    return {
      cssImportPath,
      jsImportPath,
    };
  }

  /**
   * Writes a js file containing theme imports.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeJsThemeImportFile(imports) {
    if (imports.length < 1) {
      Logger.warn(`No themes to import. Skip generating ${JAVASCRIPT_OUTPUT}.`);
      return null;
    }

    const filePath = `${path.resolve(OUTPUT_PATH, JAVASCRIPT_OUTPUT)}`;
    const file = imports.reduce((acc, s) => `${acc}import '${s.jsImportPath}';\n`, '');
    fs.writeFileSync(filePath, `${DISCLAIMER}${file}`);

    Logger.log(`Successfully generated ${JAVASCRIPT_OUTPUT}.`);
    return filePath;
  }

  static writeRootCSSFile(imports) {
    if (imports.length < 1) {
      Logger.warn(`No themes to import. Skip generating ${CSS_OUTPUT}.`);
      return null;
    }

    const filePath = `${path.resolve(OUTPUT_PATH, CSS_OUTPUT)}`;
    const result = sass.renderSync({
      data: imports.reduce((acc, s) => `${acc}@import '${s.cssImportPath}';\n`, ''),
      includePaths: imports,
    });

    fs.writeFileSync(filePath, `${DISCLAIMER}${result.css.toString().replace(/:global /g, '')}`);
    Logger.log(`Successfully generated ${CSS_OUTPUT}.`);
    return filePath;
  }
}

module.exports = ThemeAggregator;
