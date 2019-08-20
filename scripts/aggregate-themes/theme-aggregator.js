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
  static findThemeVariableFiles(themeName, options = {}) {
    const assets = ThemeAggregator.find(`**/themes/${themeName}/**/${THEME_VARIABLES}`, options);

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
   * @returns {Object} - The file paths of the generated js and CSS file.
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

    if (theme) {
      // Generate root theme.
      if (generateRoot) {
        const themeFiles = ThemeAggregator.findThemeVariableFiles(theme, options);
        if (themeFiles) {
          asset = ThemeAggregator.writeSCSSFile(themeFiles, theme, ROOT, `:${ROOT}`);
        }
        if (asset) {
          asset.includePaths = themeFiles;
          assets.push(asset);
        }
      } else {
        // Aggregate the default theme (root-theme.scss).
        asset = ThemeAggregator.aggregateTheme(theme, options);
        if (asset) { assets.push(...asset); }
      }
    }

    if (scoped) {
      if (generateScoped) {
        // Generate the scoped themes.
        scoped.forEach((scopedTheme) => {
          const { name, scopeSelector = name } = scopedTheme;
          const themeFiles = ThemeAggregator.findThemeVariableFiles(name, options);
          if (themeFiles) {
            asset = ThemeAggregator.writeSCSSFile(themeFiles, name, SCOPED, `.${scopeSelector}`);
          }
          if (asset) {
            asset.includePaths = themeFiles;
            assets.push(asset);
          }
        });
      } else {
        // Aggregate the scoped themes.
        scoped.forEach((scopedTheme) => {
          asset = ThemeAggregator.aggregateTheme(scopedTheme, options);
          if (asset) { assets.push(asset); }
        });
      }
    }

    return {
      javascriptFile: ThemeAggregator.writeJsFile(assets),
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
   * @returns {Object} - Resolved file paths containing either relative or node module paths.
   */
  static resolve(filePath) {
    // Constructs the relative path.
    const relativePath = path.relative(OUTPUT_PATH, path.resolve(OUTPUT_PATH, filePath));
    if (filePath.indexOf(NODE_MODULES) > -1) {
      const dependencyPath = filePath.substring(filePath.indexOf(NODE_MODULES) + NODE_MODULES.length);
      return {
        scssImportPath: relativePath,
        jsImportPath: dependencyPath,
      };
    }

    return {
      scssImportPath: relativePath,
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
   * Allows node-sass to correctly resolve sass loader tilde (~) paths to home directory node modules.
   * @param {string} url - the path in import as-is
   * @returns {object} an object literal containing the resolved path.
   */
  static resolveTildePath(url) {
    let resolvedPath;
    if (url[0] === '~') {
      resolvedPath = path.resolve(process.cwd(), NODE_MODULES, url.substring(1));
    }

    return { file: resolvedPath };
  }

  /**
   * Generates a theme scss file and outputs it to the generatedThemes directory.
   * @param {string} assets - The aggregated theme files to import within generated file.
   * @param {string} themeName - Name of theme to aggregate.
   * @param {string} prefix - Prefix to append to generated file.
   * @param {string} scopeSelector - scss scope selector to encase theme.
   * @returns {object} - the object containing the generated file path relative to the root directory and relative to the generatedThemes directory.
   */
  static writeSCSSFile(assets, themeName, prefix, scopeSelector) {
    const fileName = `${prefix}-${themeName}.scss`;
    const intro = `${DISCLAIMER}${scopeSelector}`;

    let file = assets.reduce((acc, s) => `${acc}  @import '../${s}';\n`, '');
    file = `${intro} {\n${file}}\n`;

    const filePath = path.resolve(OUTPUT_PATH, fileName);
    fs.writeFileSync(filePath, file);
    Logger.log(`Successfully generated ${fileName}.`);

    const scssImportPath = path.relative(process.cwd(), filePath);
    const jsImportPath = `./${path.relative(OUTPUT_PATH, filePath)}`;
    return {
      scssImportPath,
      jsImportPath,
    };
  }

  /**
   * Writes a js file containing theme imports.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeJsFile(imports) {
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

  /**
   * Writes a css file containing theme imports. Necessary for code splitting compatibility.
   * @param {Object[]} imports - An array of files to import.
   * @returns {string} - The filepath of the file.
   */
  static writeRootCSSFile(imports) {
    if (imports.length < 1) {
      Logger.warn(`No themes to import. Skip generating ${CSS_OUTPUT}.`);
      return null;
    }

    const filePath = `${path.resolve(OUTPUT_PATH, CSS_OUTPUT)}`;
    const includePaths = imports.map(
      (x) => {
        if (x.includePaths) {
          return x.includePaths;
        }
        return null;
      },
    );
    includePaths.push(path.relative(process.cwd(), path.resolve(process.cwd(), 'node_modules')));

    const result = sass.renderSync({
      data: imports.reduce((acc, s) => `${acc}@import '${s.scssImportPath}';\n`, ''),
      importer: ThemeAggregator.resolveTildePath,
      includePaths,
    });

    fs.writeFileSync(filePath, `${DISCLAIMER}${result.css.toString().replace(/:global /g, '')}`);
    Logger.log(`Successfully generated ${CSS_OUTPUT}.`);
    return filePath;
  }
}

module.exports = ThemeAggregator;
