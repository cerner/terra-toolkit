/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint arrow-body-style: ["error", "always"]*/

const testSettings = require('./index').testSettings;

let config;
/* eslint-disable global-require, import/no-dynamic-require */
if (process.env.WEBPACK_CONFIG_PATH) {
  config = require(process.env.WEBPACK_CONFIG_PATH);
} else {
  config = require('./webpack.config');
}
/* eslint-enable global-require, import/no-dynamic-require */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

config.entry.index = path.join(__dirname, 'nightwatch/fixtures/index');
config.plugins.push(new HtmlWebpackPlugin({
  template: path.join(__dirname, 'nightwatch/fixtures/index.html'),
  chunks: ['index'],
}));

module.exports = ((settings) => {
  return testSettings(config, settings);
})(require('./nightwatch.json'));
