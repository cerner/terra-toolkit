const fs = require('fs-extra');
const glob = require('glob');
import { Logger } from 'terra-toolkit-utils';

const isDirectory = filePath => (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory());

const cleanSnapshots = (config) => {
  if (!config.cleanSnapshots) {
    return;
  }

  const errorDir = config.screenshotPath || '';

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

  Logger.log('Cleaned screenshot directories\n', { context: '[Terra-Toolkit:terra-service]' });
  if (wdioConfig.logLevel !== 'silent' && removedDirs.length > 0) {
    Logger.log(removedDirs);
  }
};

module.exports = cleanSnapshots;
