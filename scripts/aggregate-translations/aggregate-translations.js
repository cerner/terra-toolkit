const aggregatedTranslations = require('terra-aggregate-translations');
const fse = require('fs-extra');
const path = require('path');
const supportedLocales = require('./i18nSupportedLocales');

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
    format: options.format || 'es5',
  };

  if (!defaultConfig.locales.includes('en')) {
    defaultConfig.locales.push('en');
  }

  return defaultConfig;
};

// wrap the aggregate-translations script to fix the missing AR translation locale.
const aggregate = (options) => {
  const aggreateOptions = defaults(options);

  aggregatedTranslations(aggreateOptions);
};

module.exports = aggregate;
