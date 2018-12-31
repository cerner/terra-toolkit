const path = require('path');
const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const getWdioConfigPath = (configPath) => {
  if (configPath) {
    return path.resolve(configPath);
  }

  // First try to find the local to process.cwd webpack config
  const localConfig = path.resolve(process.cwd(), 'wdio.conf.js');
  if (isFile(localConfig)) {
    return localConfig;
  }

  // If that is not found look for the terra-dev-site webpack config.
  return path.resolve(process.cwd(), 'node_modules', 'terra-dev-site', 'config', 'wdio', 'wdio.conf.js');
};

module.exports = getWdioConfigPath;
