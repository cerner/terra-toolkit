const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

// eslint-disable-next-line global-require, import/no-dynamic-require
const loadWdioConfig = configPath => require(path.resolve(configPath));

const isDirectory = filePath => (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory());

const cleanSnapshots = (configPath, updateReference) => {
  const wdioConfig = loadWdioConfig(configPath).config;
  const baseDir = wdioConfig.baseScreenshotDir || '';
  const errorDir = wdioConfig.screenshotPath || '';

  const patterns = [
    path.join(baseDir, '**', '__snapshots__', 'latest'),
    path.join(baseDir, '**', '__snapshots__', 'diff'),
    path.join(baseDir, '**', '__snapshots__', 'screen'),
    errorDir,
  ];

  if (updateReference) {
    patterns.push(path.join(baseDir, '**', '__snapshots__', 'reference'));
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
  console.log('> [Terra-Tookit:wdio-runner] Cleaned screenshot directories');
  if (wdioConfig.logLevel !== 'silent' && removedDirs.length > 0) {
    // eslint-disable-next-line no-console
    console.log(removedDirs);
  }
};

module.exports = cleanSnapshots;
