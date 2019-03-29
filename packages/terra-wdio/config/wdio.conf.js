const localIP = require('ip');
const glob = require('glob');

const path = require('path');
const {
  SeleniumDockerService, ServeStaticService, TerraService,
} = require('../../lib/wdio/services/index');
const visualRegressionConfig = require('./visualRegressionConf');

const ip = process.env.WDIO_EXTERNAL_HOST || localIP.address();
const externalPort = process.env.WDIO_EXTERNAL_PORT || 8080;
const internalPort = process.env.WDIO_INTERNAL_PORT || 8080;
const ci = process.env.TRAVIS || process.env.CI;
const locale = process.env.LOCALE;
const formFactor = process.env.FORM_FACTOR;
const bail = process.env.BAIL;
const cleanSnapshots = process.env.WDIO_CLEAN_SNAPSHOTS || true;

const hasPackages = process.env.npm_package_config_mono_repo;

const config = {
  specs: hasPackages ? [
    path.join('packages', '*', 'test*', 'wdio', '**', '*-spec.js'),
  ] : [
    path.join('test*', 'wdio', '**', '*-spec.js'),
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
  bail: bail || ci ? 1 : 0,
  screenshotPath: path.join('.', 'errorScreenshots'),
  cleanSnapshots,
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService],

  visualRegression: visualRegressionConfig,

  baseUrl: `http://${ip}:${externalPort}`,

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

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 20000,
    bail: bail || ci,
  },
};

if (ci) {
  config.host = 'standalone-chrome';
}

// This code only executes for monorepos.  It will create a set of suites that can then be executed
// independently and/or in parallel via 'wdio --suite suite1' for example
if (hasPackages) {
  const packageLocationsWithTests = glob.sync((path.join(process.cwd(), 'packages', '*', 'test*', 'wdio', '**', '*-spec.js')));
  fs.readdirSync(packagesDir)

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
