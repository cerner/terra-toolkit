const fs = require('fs');
const path = require('path');
const ip = require('ip');
const getCapabilities = require('./utils/getCapabilities');

const SeleniumDockerService = require('../services/wdio-selenium-docker-service');
const TerraService = require('../services/wdio-terra-service');
const AssetServerService = require('../services/wdio-asset-server-service');

const { AccessibilityReporter } = require('../reporters/accessibility-reporter');
const { SpecReporter, cleanResults, mergeResults } = require('../reporters/spec-reporter');

const {
  BROWSERS,
  FORM_FACTOR,
  LOCALE,
  SELENIUM_GRID_URL,
  SITE,
  THEME,
  WDIO_DISABLE_SELENIUM_SERVICE,
  WDIO_EXTERNAL_HOST,
  WDIO_EXTERNAL_PORT,
  WDIO_INTERNAL_PORT,
  WDIO_HOSTNAME,
} = process.env;

// Convert BROWSERS into an array. When assigned to a process.env it is cast as a string.
const browsers = BROWSERS ? BROWSERS.split(',') : undefined;
const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');

exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
    './test*/wdio/**/*-spec.js',
    './packages/*/test*/wdio/**/*-spec.js',
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: getCapabilities(browsers, !!SELENIUM_GRID_URL),
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'warn',
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  // Set the path to connect to the selenium container.
  path: '/wd/hub',
  // The hostname of the driver server.
  hostname: SELENIUM_GRID_URL || WDIO_HOSTNAME || 'localhost',
  // The port the driver server is on. The selenium grid uses port 80.
  port: SELENIUM_GRID_URL ? 80 : 4444,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: `http://${WDIO_EXTERNAL_HOST || ip.address()}:${WDIO_EXTERNAL_PORT || 8080}`,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    [TerraService, {
      /* Use to change the form factor (test viewport) used in the wdio run. */
      ...FORM_FACTOR && { formFactor: FORM_FACTOR },
      ...THEME && { theme: THEME },
    }],
    [AssetServerService, {
      ...SITE && { site: SITE },
      ...LOCALE && { locale: LOCALE },
      ...THEME && { theme: THEME },
      ...WDIO_INTERNAL_PORT && { port: WDIO_INTERNAL_PORT },
      ...fs.existsSync(defaultWebpackPath) && { webpackConfig: defaultWebpackPath },
    }],
    // Do not add the docker service if disabled.
    ...(WDIO_DISABLE_SELENIUM_SERVICE || SELENIUM_GRID_URL ? [] : [[SeleniumDockerService]]),
  ],
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  reporters: ['spec', AccessibilityReporter, SpecReporter],
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  /**
   * Gets executed once before all workers get launched.
   */
  onPrepare() {
    // Clean previous reporter results.
    cleanResults();
  },
  /**
   * Gets executed after all workers have shut down and the process is about to exit.
   * An error thrown in the `onComplete` hook will result in the test run failing.
   */
  onComplete() {
    // Merge reporter results.
    mergeResults({ formFactor: FORM_FACTOR, locale: LOCALE, theme: THEME });
  },
};
