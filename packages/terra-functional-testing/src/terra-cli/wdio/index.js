const TestRunner = require('./test-runner');

const cli = {
  command: 'wdio',
  describe: 'Run wdio tests',
  builder: (yargs) => (
    yargs.options({
      browsers: {
        type: 'array',
        describe: 'A list of browsers for the test run.',
      },
      c: {
        type: 'string',
        alias: 'config',
        describe: 'A file path to the test runner configuration.',
      },
      formFactors: {
        type: 'array',
        describe: 'A list of form factors for the test run.',
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
      themes: {
        type: 'array',
        describe: 'A list of themes for the test run.',
        default: ['terra-default-theme'],
      },
      hostname: {
        type: 'string',
        describe: 'Automation driver host address.',
      },
      port: {
        type: 'number',
        describe: 'Automation driver port.',
      },
      baseUrl: {
        type: 'string',
        describe: 'The base url.',
      },
      suite: {
        type: 'array',
        describe: 'Overrides specs and runs only the defined suites.',
      },
      spec: {
        type: 'array',
        describe: 'A list of spec file paths.',
      },
      updateScreenshots: {
        type: 'boolean',
        alias: 'u',
        describe: 'Whether or not to automatically update all reference screenshots with the latest screenshots.',
        default: false,
      },
    })
  ),
  handler: TestRunner.start,
};

module.exports = cli;
