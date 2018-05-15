const localIP = require('ip');

const AxeService = require('../../lib/wdio/services').Axe;
const TerraService = require('../../lib/wdio/services').Terra;
const SeleniumDockerService = require('../../lib/wdio/services').SeleniumDocker;
const visualRegressionConfig = require('../../lib/wdio/visualRegressionConf');
const ServeStaticService = require('../../lib/wdio/services/index').ServeStaticService;
const path = require('path');
const PackageUtilities = require('lerna/lib/PackageUtilities');
const Repository = require('lerna/lib/Repository');

const ip = process.env.WDIO_EXTERNAL_HOST || localIP.address();
const webpackPort = process.env.WDIO_EXTERNAL_PORT || 8080;
const ci = process.env.TRAVIS || process.env.CI;

const config = {
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
  bail: ci ? 1 : 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['visual-regression', AxeService, TerraService, SeleniumDockerService, ServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${ip}:${webpackPort}`,

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
const isRepoTest = !process.cwd().includes('/packages/');
if (isRepoTest) {
  // eslint-disable-next-line no-underscore-dangle
  const packageLocations = PackageUtilities.getPackages(new Repository(path.resolve('.'))).map(pkg => pkg._location);

  const numberOfSuites = 4;
  config.suites = {};
  [...Array(numberOfSuites)].forEach((_, index) => {
    config.suites[`suite${index + 1}`] = [];
  });
  const itemsPerSuite = Math.ceil(packageLocations.length / numberOfSuites);
  packageLocations.forEach((packageLocation, index) => {
    const currentSuite = `suite${Math.floor(index / itemsPerSuite) + 1}`;
    config.suites[currentSuite] = config.suites[currentSuite].concat(`${packageLocation}/tests/wdio/**/*-spec.js`);
  });
}

exports.config = config;
