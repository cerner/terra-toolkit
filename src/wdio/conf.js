const AxeService = require('./services').Axe;
const TerraService = require('./services').Terra;
const visualRegression = require('./visualcompare');
const SeleniumDockerService = require('./services').SeleniumDocker;

exports.config = {
  specs: ['./tests/specs/**/*.js'],

  maxInstances: 10,

  capabilities: [
    {
      browserName: 'chrome',
    },
  ],

  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './errorShots/',
  waitforTimeout: 10000,
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
