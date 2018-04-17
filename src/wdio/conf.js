const localIP = require('ip');

const AxeService = require('./services').Axe;
const TerraService = require('./services').Terra;
const SeleniumDockerService = require('./services').SeleniumDocker;
const visualRegressionConfig = require('./visualRegressionConf');
const ServeStaticService = require('./services/index').ServeStaticService;
const path = require('path');

const webpackPort = 8080;

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
  bail: 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService, ServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${localIP.address()}:${webpackPort}`,

  // Ignore deprecation warnings. When chrome supports /actions API we'll update to use those.
  deprecationWarnings: false,

  axe: {
    inject: true,
    options: {
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    },
  },

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
  },
};
