const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

// eslint-disable-next-line global-require, import/no-dynamic-require
const loadWdioConfig = configPath => require(path.resolve(configPath));

const isDirectory = filePath => (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory());

const cleanSnapshots = (options) => {
  const {
    configPath, removeReference,
  } = options;

  const wdioConfig = loadWdioConfig(configPath).config;
  const errorDir = wdioConfig.screenshotPath || '';

  const patterns = [
    `${process.cwd()}/**/__snapshots__/latest`,
    `${process.cwd()}/**/__snapshots__/diff`,
    `${process.cwd()}/**/__snapshots__/screen`,
    errorDir,
  ];

  if (removeReference) {
    patterns.push(`${process.cwd()}/**/__snapshots__/reference`);
  }

  let screenshotDirectories = [];
  patterns.forEach((pattern) => {
    screenshotDirectories = screenshotDirectories.concat(glob.sync(pattern));
  });

  const removedDirs = [];
  screenshotDirectories.forEach((dir) => {
    if (isDirectory(dir)) {
      removedDirs.push(dir);
      fs.removeSync(dir);
    }
  });

  // eslint-disable-next-line no-console
  console.log('> [Terra-Tookit:wdio-clean-screenshots] Cleaned screenshot directories');
  if (wdioConfig.logLevel !== 'silent' && removedDirs.length > 0) {
    // eslint-disable-next-line no-console
    console.log(removedDirs);
  }
};

module.exports = cleanSnapshots;
