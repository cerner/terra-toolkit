const localIP = require("ip");

const staticServerPort = 4567;
const AxeService = require('./lib/wdio/services').Axe;
const TerraService = require('./lib/wdio/services').Terra;
const visualRegression = require('./lib/wdio/visualcompare');

// Force firefox into headless mode
process.env.MOZ_HEADLESS = '1';
// docker run -d -p 4444:4444 selenium/standalone-chrome
exports.config = {
  specs: ['./tests/specs/**/*.js'],

  maxInstances: 10,

  capabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: [
          'headless',
          'no-sandbox',
        ],
      },
    },
  //  {
    //  browserName: 'firefox',
    //},
  ],

  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './errorShots/',
  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl: `http://${localIP.address()}:${staticServerPort}`,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,

  services: ['static-server', 'visual-regression', AxeService, TerraService],
  staticServerPort: 4567,
  staticServerFolders: [
    { mount: '/', path: './tests/fixtures' },
  ],

  visualRegression,

  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
  },
};
