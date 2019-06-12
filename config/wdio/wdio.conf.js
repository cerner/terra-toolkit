const localIP = require('ip');
const glob = require('glob');
const path = require('path');
const determineSeleniumConfig = require('./selenium.config').determineConfig;
const { dynamicRequire } = require('../configUtils');

const {
  SeleniumDocker: SeleniumDockerService, ServeStaticService, Terra: TerraService,
} = require('../../lib/wdio/services/index');
const visualRegressionConfig = require('./visualRegressionConf');

/* Use to pass your host's IP when running wdio tests from a VM or behind a proxy. */
const ip = process.env.WDIO_EXTERNAL_HOST || localIP.address();

/* Use to post the wdio run to a different docker port. */
const externalPort = process.env.WDIO_EXTERNAL_PORT || 8080;

/* Use to run wdio tests on a different port. */
const internalPort = process.env.WDIO_INTERNAL_PORT || 8080;

/* Use to set configuration for build tools like Travis CI. */
const ci = process.env.CI;

/* Use to bail fast while running locally. */
const bail = process.env.WDIO_BAIL || ci;

/* Use to change the locale used in the wdio run. */
const locale = process.env.LOCALE;

/* Use to change the form factor (test viewport) used in the wdio run. */
const formFactor = process.env.FORM_FACTOR;

/* Use to disable running webpack in the ServeStatic Service, provide the packed site to serve directly. */
const site = process.env.SITE;

/* Use to set enable running test against a hosted selenium grid. Enables IE capabilities if the grid supports it. */
const seleniumGridUrl = process.env.SELENIUM_GRID_URL;

/**
 * Use to run tests against the various browsers. Headless Chrome and Headless Firefox browsers are available. IE is
 * an option when a SELENIUM_GRID_URL is provided.
 */
const browsers = process.env.BROWSERS;

const hasPackages = glob.sync((path.join(process.cwd(), 'packages'))).length > 0;

const seleniumConfig = determineSeleniumConfig({
  ci, seleniumGridUrl, browsers,
});

// Try to find the local to process.cwd webpack config
const webpackConfig = dynamicRequire(path.resolve(process.cwd(), 'webpack.config.js'));

const config = {
  ...webpackConfig && { webpackConfig },
  ...seleniumConfig,

  specs: hasPackages ? [
    path.join('packages', '*', 'test*', 'wdio', '**', '*-spec.js'),
  ] : [
    path.join('test*', 'wdio', '**', '*-spec.js'),
  ],

  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  bail: bail ? 1 : 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 1200000,
  connectionRetryCount: 1,
  services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${ip}:${externalPort}`,

  ...site && { site },
  serveStatic: {
    port: internalPort,
  },
  ...locale && { locale },
  ...formFactor && { formFactor },

  // Ignore deprecation warnings. When chrome supports /actions API we'll update to use those.
  deprecationWarnings: false,

  axe: {
    inject: true,
  },

  terra: {
    selector: '[data-terra-dev-site-content] *:first-child',
  },

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 1200000,
    bail,
  },
};

// This code only executes for monorepos.  It will create a set of suites that can then be executed
// independently and/or in parallel via 'wdio --suite suite1' for example
if (hasPackages) {
  const packageLocationsWithTests = glob.sync((path.join(process.cwd(), 'packages', '*', 'test*', 'wdio', '**', '*-spec.js')));

  const numberOfPackagesWithTests = packageLocationsWithTests.length;
  if (numberOfPackagesWithTests > 0) {
    const numberOfSuites = Math.min(numberOfPackagesWithTests, 4);
    config.suites = {};
    [...Array(numberOfSuites)].forEach((_, index) => {
      config.suites[`suite${index + 1}`] = [];
    });

    packageLocationsWithTests.forEach((packageLocation, index) => {
      const currentSuite = `suite${(index % numberOfSuites) + 1}`;
      config.suites[currentSuite] = config.suites[currentSuite].concat(packageLocation);
    });
  }
}

exports.config = config;
