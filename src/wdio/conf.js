const AxeService = require('./services').Axe;
const TerraService = require('./services').Terra;
const visualRegression = require('./visualRegressionConf');
const SeleniumDockerService = require('./services').SeleniumDocker;
const path = require('path');

exports.config = {
  specs: [path.join('.', 'tests', 'specs', '**', '*.js')],
  maxInstances: 5,
  capabilities: [
    {
      browserName: 'chrome',
    },
  ],

  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  bail: 0,
  screenshotPath: path.join('.', 'errorShots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService],
  visualRegression,
  framework: 'mocha',

  axe: {
    inject: true,
  },

  mochaOpts: {
    ui: 'bdd',
  },
};
