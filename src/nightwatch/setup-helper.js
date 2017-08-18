const path = require('path');
const fs = require('fs');
const loadJsonFile = require('load-json-file');
const globSync = require('glob').sync;

const interatePackageDirectories = (lernaJSON) => {
  const srcFolders = [];
  loadJsonFile.sync(lernaJSON).packages.forEach((globPath) => {
    globSync(globPath).forEach((packagePath) => {
      const testPath = `${packagePath}/tests/nightwatch/`;
      if (fs.existsSync(testPath)) {
        srcFolders.push(testPath);

        const files = fs.readdirSync(testPath);
        files.forEach((file) => {
          const subDir = path.join(testPath, file);
          if (fs.statSync(subDir).isDirectory()) {
            srcFolders.push(subDir);
          }
        });
      }
    });
  });
  return srcFolders;
};

const interateDirectories = (basePath) => {
  const srcFolders = [];
  const testPath = `${basePath}/tests/nightwatch/`;
  if (fs.existsSync(testPath)) {
    srcFolders.push(testPath);

    const files = fs.readdirSync(testPath);
    files.forEach((file) => {
      const subDir = path.join(testPath, file);
      if (fs.statSync(subDir).isDirectory()) {
        srcFolders.push(subDir);
      }
    });
  }
  return srcFolders;
};

const getTestDirectories = (info) => {
  if (info === 'lerna.json') {
    return interatePackageDirectories(info);
  }
  return interateDirectories(info);
};

module.exports.getTestDirectories = getTestDirectories;
