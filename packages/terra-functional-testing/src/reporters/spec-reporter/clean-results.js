const fs = require('fs');
const path = require('path');
const getOutputDir = require('./get-output-dir');

/**
 * Cleans the output directory by removing any previous spec reports.
 */
const cleanResults = (subOutputDir) => {
  const outputDir = getOutputDir(subOutputDir);

  if (!fs.existsSync(outputDir)) {
    return;
  }

  const files = fs.readdirSync(outputDir);

  files.forEach((file) => {
    if (file.indexOf('wdio-spec-results') > -1) {
      fs.unlinkSync(path.resolve(outputDir, file));
    }
  });
};

module.exports = cleanResults;
