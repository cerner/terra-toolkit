const TestRunner = require('./test-runner');

const cli = {
  command: 'wdio',
  describe: 'Run wdio tests',
  builder: (yargs) => (
    yargs.options({
      assetServerPort: {
        type: 'number',
        describe: 'The port to run the webpack and express asset services on.',
        default: () => {
          if (process.env.WDIO_INTERNAL_PORT) {
            return process.env.WDIO_INTERNAL_PORT;
          }

          return 8080;
        },
      },
      browsers: {
        type: 'array',
        describe: 'A list of browsers for the test run.',
        default: () => {
          let browsers = process.env.BROWSERS;
          if (browsers) {
            // Remove the brackets if BROWSERS is set as an array like ['chrome, firefox, ie'] or ['chrome','firefox','ie'] in Jenkinsfile.
            browsers = browsers.replace('[', '');
            browsers = browsers.replace(']', '');

            // Split the list of BROWSERS into an array if it is set in the string form like 'chrome,firefox,ie'.
            if (browsers.includes(',')) {
              return browsers.split(',');
            }

            return [browsers];
          }

          return [];
        },
      },
      c: {
        type: 'string',
        alias: 'config',
        describe: 'A file path to the test runner configuration.',
      },
      disableSeleniumService: {
        type: 'boolean',
        describe: 'A flag to disable the selenium docker service.',
        default: false,
      },
      ignoreScreenshotMismatch: {
        type: 'boolean',
        describe: 'A flag to disable failing on screenshot mismatch.',
        default: false,
      },
      externalHost: {
        type: 'string',
        describe: 'The host address the testing environment is connected to.',
        default: () => {
          if (process.env.WDIO_EXTERNAL_HOST) {
            return process.env.WDIO_EXTERNAL_HOST;
          }

          return undefined;
        },
      },
      externalPort: {
        type: 'number',
        describe: 'The port mapping from the host to the container.',
        default: () => {
          if (process.env.WDIO_EXTERNAL_PORT) {
            return process.env.WDIO_EXTERNAL_PORT;
          }

          return undefined;
        },
      },
      formFactors: {
        type: 'array',
        describe: 'A list of form factors for the test run.',
        default: () => {
          if (process.env.FORM_FACTOR) {
            return [process.env.FORM_FACTOR];
          }

          return [];
        },
      },
      gridUrl: {
        type: 'string',
        describe: 'The remote selenium grid address.',
        default: () => {
          if (process.env.SELENIUM_GRID_URL) {
            return process.env.SELENIUM_GRID_URL;
          }

          return undefined;
        },
      },
      keepAliveSeleniumDockerService: {
        type: 'boolean',
        describe: 'Determines to keep the selenium docker service running upon test completion.',
        default: false,
      },
      locales: {
        type: 'array',
        describe: 'A list of language locales for the test run.',
        default: () => {
          if (process.env.LOCALE) {
            return [process.env.LOCALE];
          }

          return ['en'];
        },
      },
      site: {
        type: 'string',
        describe: 'A file path to a static directory of assets. When defined, an express server will launch to serve the assets and disable running webpack.',
        default: () => {
          if (process.env.SITE) {
            return process.env.SITE;
          }

          return undefined;
        },
      },
      spec: {
        type: 'array',
        describe: 'A list of spec file paths.',
      },
      suite: {
        type: 'array',
        describe: 'Overrides specs and runs only the defined suites.',
      },
      themes: {
        type: 'array',
        describe: 'A list of themes for the test run.',
        default: () => {
          if (process.env.THEME) {
            return [process.env.THEME];
          }

          return [undefined];
        },
      },
      u: {
        type: 'boolean',
        alias: 'updateScreenshots',
        describe: 'Whether or not to automatically update all reference screenshots with the latest screenshots.',
        default: false,
      },
      useSeleniumStandaloneService: {
        type: 'boolean',
        describe: 'A flag to use the selenium standalone service instead of the selenium docker service.',
        default: process.env.USE_SELENIUM_STANDALONE_SERVICE === 'true',
      },
    })
  ),
  handler: TestRunner.start,
};

module.exports = cli;
