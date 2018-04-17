// eslint-disable-next-line import/no-extraneous-dependencies
const wdioConf = require('./lib/wdio/conf');
const webpackConfig = require('./tests/test.config.js');

const config = {
  ...wdioConf.config,

  terra: {
    selector: '[data-terra-toolkit-content]',
  },

  // Configuration for ExpressDevService
  webpackConfig,
};

exports.config = config;
