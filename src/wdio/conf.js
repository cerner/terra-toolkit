const AxeService = require('./services').Axe;
const TerraService = require('./services').Terra;
const SeleniumDockerService = require('./services').SeleniumDocker;
const visualRegression = require('./visualRegressionConf');
const path = require('path');

exports.config = {
  specs: [path.join('.', 'tests', 'wdio', '**', '*-spec.js')],
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
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService],
  visualRegression,
  framework: 'mocha',
  terra: {
    selector: '[data-reactroot]',
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

  mochaOpts: {
    ui: 'bdd',
  },
};
