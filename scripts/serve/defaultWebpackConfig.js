const path = require('path');
const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const resolve = (filePath) => {
  if (isFile(filePath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(filePath);
  }
  return undefined;
};

const defaultWebpackConfig = () => {
  // First try to find the local to process.cwd webpack config
  const localConfig = resolve(path.resolve(process.cwd(), 'webpack.config.js'));
  if (localConfig) {
    return localConfig;
  }

  // If that is not found look for the terra-dev-site webpack config.
  return resolve(path.resolve(process.cwd(), 'node_modules', 'terra-dev-site', 'src', 'webpack', 'webpack.config.js'));
};

module.exports = defaultWebpackConfig;
