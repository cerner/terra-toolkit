const babelJest = require('babel-jest');
const { configLocation } = require('@cerner/terra-babel/config');

/**
 * Jest uses babel.config.js to compile during the test runs. To correctly resolve babel's config root
 * (because terra-clinical is a mono-repo), a custom transformer is needed for jest.
 * See: https://babeljs.io/docs/en/config-files#jest
 */
const customTransformer = babelJest.createTransformer({
  rootMode: 'upward-optional',
  configFile: configLocation,
});

module.exports = customTransformer;
