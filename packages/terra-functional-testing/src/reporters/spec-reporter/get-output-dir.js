const fs = require('fs');
const path = require('path');

/**
 * Determines the output directory for reporter results.
 * @returns {string} - An output directory.
 */
const getOutputDir = () => {
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, 'test'))) {
    return path.resolve(cwd, 'test', 'wdio', 'reports');
  }

  return path.resolve(cwd, 'tests', 'wdio', 'reports');
};

module.exports = getOutputDir;
