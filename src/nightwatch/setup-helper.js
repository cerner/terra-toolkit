const fs = require('fs');
const loadJsonFile = require('load-json-file');
const globSync = require('glob').sync;

const getPackageTestDirectories = lernaJSON =>
  loadJsonFile.sync(lernaJSON).packages
    .map(globPath =>
      globSync(globPath)
        .map(packagePath => `${packagePath}/tests/nightwatch/`)
        .filter(fs.existsSync))
    .reduce((a, b) => a.concat(b), []);

module.exports.getPackageTestDirectories = getPackageTestDirectories;
