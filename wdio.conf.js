// eslint-disable-next-line import/no-extraneous-dependencies
const wdioConf = require('./lib/wdio/conf');
const ExpressDevService = require('./lib/wdio/services/index').ExpressDevService;
const webpackConfig = require('./tests/test.config.js');
const localIP = require('ip');
const path = require('path');

const port = 8080;

const config = {
  ...wdioConf.config,
  baseUrl: `http://${localIP.address()}:${port}`,
  specs: [path.join('.', 'tests', 'wdio', '**-spec.js')],

  // Configuration for ExpressDevService
  webpackConfig,

  // Configuration for SeleniumDocker service
  seleniumDocker: {
    enabled: !process.env.TRAVIS,
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
};

config.services = wdioConf.config.services.concat([ExpressDevService]);
exports.config = config;
