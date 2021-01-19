const fs = require('fs');
const path = require('path');
const getOutputDir = require('./get-output-dir');

/**
 * Cleans the output directory by removing any previous spec reports.
 * @param {string} outputDir - The output directory to clean.
 */
const cleanResults = (outputDir) => {
  const directory = outputDir || getOutputDir();

  if (!fs.existsSync(directory)) {
    return;
  }

  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    if (file.indexOf('wdio-spec-results') > -1) {
      fs.unlinkSync(path.resolve(directory, file));
    }
  });
};

module.exports = cleanResults;
