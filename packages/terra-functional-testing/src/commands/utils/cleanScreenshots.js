const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const { Logger } = require('@cerner/terra-cli');

const logger = new Logger({ prefix: '[terra-functional-testing:clean-snapshots]' });

// eslint-disable-next-line global-require, import/no-dynamic-require
const isDirectory = filePath => (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory());

async function cleanScreenshots() {
  const monoRepoPath = path.resolve(process.cwd(), 'packages');
  const isMonoRepo = fs.existsSync(monoRepoPath);
  let patterns = [];

  if (isMonoRepo) {
    const packageNames = fs.readdirSync(monoRepoPath);

    packageNames.forEach((packageName) => {
      patterns.push(path.resolve(monoRepoPath, packageName, 'tests', 'wdio', '__snapshots__', 'diff'));
      patterns.push(path.resolve(monoRepoPath, packageName, 'tests', 'wdio', '__snapshots__', 'error'));
      patterns.push(path.resolve(monoRepoPath, packageName, 'tests', 'wdio', '__snapshots__', 'latest'));
    });
  } else {
    patterns = [
      `${process.cwd()}/tests/wdio/__snapshots__/diff`,
      `${process.cwd()}/tests/wdio/__snapshots__/error`,
      `${process.cwd()}/tests/wdio/__snapshots__/latest`,
    ];
  }

  let screenshotDirectories = [];
  patterns.forEach((pattern) => {
    screenshotDirectories = screenshotDirectories.concat(glob.sync(pattern));
  });

  screenshotDirectories.forEach((dir) => {
    if (isDirectory(dir)) {
      fs.removeSync(dir);
    }
  });

  logger.info('Cleaned wdio snapshots directories.');
}

module.exports = cleanScreenshots;
