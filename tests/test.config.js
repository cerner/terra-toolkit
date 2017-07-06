// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */

const config = require('../webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

config.entry.index = path.join(__dirname, 'nightwatch/fixtures/index');
config.plugins.push(new HtmlWebpackPlugin({
  template: path.join(__dirname, 'nightwatch/fixtures/index.html'),
  chunks: ['index'],
}));

module.exports = config;
