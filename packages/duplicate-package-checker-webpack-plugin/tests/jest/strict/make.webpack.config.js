const path = require('path');
const DuplicatePackageCheckerPlugin = require('../../../src');

module.exports = function make(options) {
  return {
    entry: './entry.js',
    mode: 'development',
    context: __dirname,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    plugins: [new DuplicatePackageCheckerPlugin(options)],
  };
};
