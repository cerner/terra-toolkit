const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const supportedLocales = require('./i18nSupportedLocales');

const aggregateMessages = require('./aggregate-messages');
const writeAggregatedTranslations = require('./write-aggregated-translations');
const writeI18nLoaders = require('./write-i18n-loaders');

const defaultSearchPatterns = baseDirectory => ([
  path.resolve(baseDirectory, 'translations'), // root level translations
  path.resolve(baseDirectory, 'node_modules', '**', 'translations'), // root level dependency translations
  path.resolve(baseDirectory, 'packages', 'terra-*', 'translations'), // package level translations
  path.resolve(baseDirectory, 'packages', '**', 'node_modules', '**', 'translations'), // package level dependency translations
]);

const resolveDirectories = baseDirectory => directories => (directories.map(dir => path.resolve(baseDirectory, dir)));

const isFile = filePath => (fse.existsSync(filePath) && !fse.lstatSync(filePath).isDirectory());

const loadConfigFile = (configPath) => {
  if (configPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(configPath);
  }

  const localPath = path.resolve(process.cwd(), 'terraI18n.config.js');
  if (isFile(localPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(localPath);
  }
  return {};
};

const defaults = (options = {}) => {
  const config = loadConfigFile(options.configPath);

  const defaultConfig = {
    baseDir: options.baseDir || config.baseDir || process.cwd(),
    directories: options.directories || config.directories || [],
    fileSystem: options.outputFileSystem || config.outputFileSystem || fse,
    locales: options.locales || config.locales || supportedLocales,
    outputDir: options.outputDir || './aggregated-translations',
    excludes: options.excludes || config.excludes || [],
  };

  if (!defaultConfig.locales.includes('en')) {
    defaultConfig.locales.push('en');
  }

  return defaultConfig;
};

const excludeThesePaths = (paths) => {
  const pathsSet = new Set(paths);
  return (p => !pathsSet.has(p));
};

const aggregatedTranslations = (options) => {
  const {
    baseDir, directories, fileSystem, locales, outputDir, excludes,
  } = defaults(options);

  const resolve = resolveDirectories(baseDir);

  const searchPaths = [
    ...defaultSearchPatterns(baseDir),
    ...resolve(directories),
  ].filter(excludeThesePaths(resolve(excludes)));

  const translationDirectories = searchPaths.map(searchPath => glob.sync(searchPath));

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
