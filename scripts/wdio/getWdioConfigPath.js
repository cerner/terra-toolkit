const path = require('path');
const Logger = require('../utils/logger');
const { isFile } = require('../../config/configUtils');

const getWdioConfigPath = (configPath) => {
  if (configPath) {
    return path.resolve(configPath);
  }

  // Try to find the local to process.cwd webpack config
  const localConfig = path.resolve(process.cwd(), 'wdio.conf.js');
  if (isFile(localConfig)) {
    return localConfig;
  }

  // Throw error is config not provided and local config is not found.
  return Logger.error('A wdio config path was not provided and a local config was not found.\n', { context: '[Terra-Toolkit:wdio-runner]:' });
};

module.exports = getWdioConfigPath;
