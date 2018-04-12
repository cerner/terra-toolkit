const localIP = require('ip');

const AxeService = require('./services').Axe;
const TerraService = require('./services').Terra;
const SeleniumDockerService = require('./services').SeleniumDocker;
const visualRegressionConfig = require('./visualRegressionConf');
const TerraToolkitServeStaticService = require('./services/index').TerraToolkitServeStaticService;
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
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService, TerraToolkitServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${localIP.address()}:${webpackPort}`,

  // Configuration for SeleniumDocker service
  seleniumDocker: {
    enabled: !process.env.TRAVIS,
  },

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

  beforeHook() {
    // Ensure the mouse starts in upper left corner before every test.
    // This prevents unwanted hover effects during visual comparison.
    // Note: moveTo() is deprecated, so this simulates that by creating an
    // element that webdriver clicks on that is in the upper left corner of the
    // screen.
    // eslint-disable-next-line func-names, prefer-arrow-callback
    global.browser.execute(function () {
      // eslint-disable-next-line no-var
      var div = document.createElement('div');
      document.body.appendChild(div);
      div.id = 'wdioMouseReset';
      div.style.position = 'absolute';
      div.style.top = 0;
      div.style.left = 0;
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.zIndex = '9999999';
      // eslint-disable-next-line func-names, prefer-arrow-callback
      div.addEventListener('click', function () {
        document.body.removeChild(div);
      });
    });
    global.browser.click('#wdioMouseReset');
  },

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
  },
};
