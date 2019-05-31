const localIP = require('ip');
const glob = require('glob');

const path = require('path');
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

const hasPackages = glob.sync((path.join(process.cwd(), 'packages'))).length > 0;

const config = {
  specs: hasPackages ? [
    path.join('packages', '*', 'test*', 'wdio', '**', '*-spec.js'),
  ] : [
    path.join('test*', 'wdio', '**', '*-spec.js'),
  ],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      /** Run in headless mode since Chrome 69 cannot reach the tiny viewport size due to a omnibox size change
       * made by the chrome team. See https://bugs.chromium.org/p/chromedriver/issues/detail?id=2626#c1.
       */
      args: ['headless', 'disable-gpu'],
    },
  }],

  sync: true,
  logLevel: 'silent',
  coloredLogs: true,
  bail: bail ? 1 : 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
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

  seleniumVersion: '3.14',
  seleniumDocker: {
    enabled: !ci,
  },

  // Ignore deprecation warnings. When chrome supports /actions API we'll update to use those.
  deprecationWarnings: false,

  axe: {
    inject: true,
  },

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
    bail,
  },
};

if (ci) {
  config.host = 'standalone-chrome';
}

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
