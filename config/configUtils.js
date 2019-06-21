const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const dynamicRequire = (filePath) => {
  if (isFile(filePath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(filePath);
  }
  return undefined;
};

module.exports = {
  isFile,
  dynamicRequire,
};
