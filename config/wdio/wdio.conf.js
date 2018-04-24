const localIP = require('ip');

const AxeService = require('../../lib/wdio/services').Axe;
const TerraService = require('../../lib/wdio/services').Terra;
const SeleniumDockerService = require('../../lib/wdio/services').SeleniumDocker;
const visualRegressionConfig = require('../../lib/wdio/visualRegressionConf');
const ServeStaticService = require('../../lib/wdio/services/index').ServeStaticService;
const path = require('path');

const ip = process.env.WDIO_EXTERNAL_HOST || localIP.address();
const webpackPort = process.env.WDIO_EXTERNAL_PORT || 8080;

exports.config = {
  specs: [
    path.join('tests', 'wdio', '**', '*-spec.js'),
    path.join('packages', '*', 'tests', 'wdio', '**', '*-spec.js'),
  ],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
    },
  ],

  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  bail: 1,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService, ServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${ip}:${webpackPort}`,

  // Ignore deprecation warnings. When chrome supports /actions API we'll update to use those.
  deprecationWarnings: false,

  axe: {
    inject: true,
  },

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
    bail: true,
  },
};
