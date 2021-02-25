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
          if (process.env.BROWSERS) {
            return [process.env.BROWSERS];
          }

          return undefined;
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
      externalHost: {
        type: 'string',
        describe: 'The host address the testing environment is connected to.',
      },
      externalPort: {
        type: 'number',
        describe: 'The port mapping from the host to the container.',
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
      },
      keepAliveSeleniumDockerService: {
        type: 'boolean',
        describe: 'Determines to keep the selenium docker service running upon test completion.',
        default: false,
      },
      locales: {
        type: 'array',
        describe: 'A list of language locales for the test run.',
        default: ['en'],
      },
      site: {
        type: 'string',
        describe: 'A file path to a static directory of assets. When defined, an express server will launch to serve the assets and disable running webpack.',
        default: () => {
          if (process.env.THEME) {
            return [process.env.THEME];
          }

          return ['terra-default-theme'];
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

          return ['terra-default-theme'];
        },
      },
      u: {
        type: 'boolean',
        alias: 'updateScreenshots',
        describe: 'Whether or not to automatically update all reference screenshots with the latest screenshots.',
        default: false,
      },
    })
  ),
  handler: (config) => {
    console.log(config);
  }, // TestRunner.start,
  config: () => {
    console.log('config');
  },
  defaults: () => {
    console.log('default');
  },
};

module.exports = cli;
