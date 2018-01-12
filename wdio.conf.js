// eslint-disable-next-line import/no-extraneous-dependencies
const wdioConf = require('./lib/wdio/conf');
const WebpackDevService = require('./lib/wdio/services/index').WebpackDevService;
const webpackConfig = require('./tests/test.config.js');
const localIP = require('ip');
const path = require('path');

const webpackPort = 8080;

const config = {
  ...wdioConf.config,
  baseUrl: `http://${localIP.address()}:${webpackPort}`,
  specs: [path.join('.', 'tests', 'wdio', '**-spec.js')],

  // Configuration for WebpackDevService
  webpackPort,
  webpackConfig,

  // Configuration for SeleniumDocker service
  seleniumDocker: {
    enabled: !process.env.TRAVIS,
  },

  axe: {
    options: {
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    },
  },
};


config.services = wdioConf.config.services.concat([WebpackDevService]);
exports.config = config;
