// eslint-disable-next-line import/no-extraneous-dependencies
const wdioConf = require('./config/wdio/wdio.conf');
const webpackConfig = require('./tests/test.config.js');

const config = {
  ...wdioConf.config,

  terra: {
    selector: '[data-terra-toolkit-content]',
  },

  axe: {
    inject: true,
    options: {
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    },
  },

  // Configuration for the SeleniumDocker service
  seleniumDocker: {
    enabled: !process.env.TRAVIS,
  },

  // Configuration for ExpressDevService
  webpackConfig,
};

exports.config = config;
