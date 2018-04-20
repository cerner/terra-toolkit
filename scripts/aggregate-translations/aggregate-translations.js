const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const supportedLocales = require('./i18nSupportedLocales');

const aggregateMessages = require('./aggregate-messages');
const writeAggregatedTranslations = require('./write-aggregated-translations');
const writeI18nLoaders = require('./write-i18n-loaders');

const defaultSearchPatterns = baseDirectory => ([
  path.resolve(baseDirectory, 'translations'), // root level translations
  path.resolve(baseDirectory, 'node_modules', 'terra-*', 'translations'), // root level dependency translations
  path.resolve(baseDirectory, 'packages', 'terra-*', 'translations'), // package level translations
  path.resolve(baseDirectory, 'packages', 'terra-*', 'node_modules', 'terra-*', 'translations'), // package level dependency translations
]);

const customDirectories = (baseDirectory, directories) =>
  (directories.map(dir => path.resolve(baseDirectory, dir)));

const isFile = filePath => (fse.existsSync(filePath) && !fse.lstatSync(filePath).isDirectory());

const loadConfigFile = (configPath) => {
  const i18nConfigPath = path.resolve(process.cwd(), configPath);
  if (isFile(i18nConfigPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(i18nConfigPath);
  }
  return {};
};

const defaults = (options = {}) => {
  const configPath = options.configPath || './terraI18n.config.js';
  const config = loadConfigFile(configPath);

  const defaultConfig = {
    baseDir: options.baseDir || config.baseDir || process.cwd(),
    directories: options.directories || config.directories || [],
    fileSystem: options.outputFileSystem || config.outputFileSystem || fse,
    locales: options.locales || config.locales || supportedLocales,
    outputDir: options.outputDir || './aggregated-translations',
  };

  if (!defaultConfig.locales.includes('en')) {
    defaultConfig.locales.push('en');
  }

  return defaultConfig;
};

const aggregatedTranslations = (options) => {
  const { baseDir, directories, fileSystem, locales, outputDir } = defaults(options);

  const searchPaths = defaultSearchPatterns(baseDir).concat(customDirectories(baseDir, directories));

  let translationDirectories = [];
  searchPaths.forEach((searchPath) => {
    translationDirectories = translationDirectories.concat(glob.sync(searchPath));
  });

  // Aggregate translation messages for each of the translations directories
  const aggregatedMessages = aggregateMessages(translationDirectories, locales);

  const outputDirectory = path.resolve(baseDir, outputDir);
  fileSystem.mkdirpSync(outputDirectory);

  // Write aggregated translation messages to a file for each locale
  writeAggregatedTranslations(aggregatedMessages, locales, fileSystem, outputDirectory);

  // Write intl and translations loaders for the specified locales
  writeI18nLoaders(locales, fileSystem, outputDirectory);
};

module.exports = aggregatedTranslations;
