const localIP = require('ip');
const glob = require('glob');

const path = require('path');
const {
  SeleniumDocker: SeleniumDockerService, ServeStaticService
} = require('../../lib/wdio/services/index');

const ip = process.env.WDIO_EXTERNAL_HOST || localIP.address();

const config = {
  specs: [
    path.join('test*', 'wdio', '**', '*-spec.js'),
  ],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
    },
    {
      browserName: 'firefox',
    },
  ],

  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  bail: 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: [SeleniumDockerService, ServeStaticService],

  baseUrl: `http://${ip}:8080`,

  // Ignore deprecation warnings. When chrome supports /actions API we'll update to use those.
  deprecationWarnings: false,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
  },
};

exports.config = config;
