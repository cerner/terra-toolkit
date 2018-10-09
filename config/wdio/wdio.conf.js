const localIP = require('ip');
const glob = require('glob');

const path = require('path');
const PackageUtilities = require('lerna/lib/PackageUtilities');
const Repository = require('lerna/lib/Repository');
const {
  Axe: AxeService, SeleniumDocker: SeleniumDockerService, ServeStaticService, Terra: TerraService,
} = require('../../lib/wdio/services/index');
const visualRegressionConfig = require('./visualRegressionConf');

const ip = process.env.WDIO_EXTERNAL_HOST || localIP.address();
const externalPort = process.env.WDIO_EXTERNAL_PORT || 8080;
const internalPort = process.env.WDIO_INTERNAL_PORT || 8080;
const ci = process.env.TRAVIS || process.env.CI;
const locale = process.env.LOCALE;
const formFactor = process.env.FORM_FACTOR;

const config = {
  specs: [
    path.join('test', 'wdio', '**', '*-spec.js'),
    path.join('tests', 'wdio', '**', '*-spec.js'),
    path.join('packages', '*', 'test', 'wdio', '**', '*-spec.js'),
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
  bail: ci ? 1 : 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService, ServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${ip}:${externalPort}`,

  serveStatic: {
    port: internalPort,
  },
  ...locale && { locale },
  ...formFactor && { formFactor },

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
    bail: ci,
  },
};

if (ci) {
  config.host = 'standalone-chrome';
}

// This code only executes for monorepos.  It will create a set of suites that can then be executed
// independently and/or in parallel via 'wdio --suite suite1' for example
const isRepoTest = !process.cwd().includes('packages');
if (isRepoTest) {
  const packageLocationsWithTests = PackageUtilities.getPackages(new Repository(path.resolve('.')))
    // eslint-disable-next-line no-underscore-dangle
    .map(pkg => path.join(pkg._location, 'tests', 'wdio', '**', '*-spec.js'))
    .filter(packageLocation => glob.sync(packageLocation).length > 0);

  const numberOfSuites = 4;
  config.suites = {};
  [...Array(numberOfSuites)].forEach((_, index) => {
    config.suites[`suite${index + 1}`] = [];
  });
  const itemsPerSuite = Math.ceil(packageLocationsWithTests.length / numberOfSuites);
  packageLocationsWithTests.forEach((packageLocation, index) => {
    const currentSuite = `suite${Math.floor(index / itemsPerSuite) + 1}`;
    config.suites[currentSuite] = config.suites[currentSuite].concat(packageLocation);
  });
}

exports.config = config;
