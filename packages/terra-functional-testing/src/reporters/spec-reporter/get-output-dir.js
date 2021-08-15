const path = require('path');

/**
 * Returns the default output directory for reporter results.
 * @param {string} - Subdirector under `test` to generate report.
 * @returns {string} - An output directory.
 */
const getOutputDir = (outputDir = 'wdio') => path.resolve(process.cwd(), 'tests', outputDir, 'reports');

module.exports = getOutputDir;
