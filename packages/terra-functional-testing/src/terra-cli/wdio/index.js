const TestRunner = require('./test-runner');

const cli = {
  command: 'wdio',
  describe: 'Run wdio tests',
  builder: (yargs) => (
    yargs.options({
      c: {
        type: 'string',
        alias: 'config',
        describe: 'A file path to the test runner configuration.',
      },
      formFactors: {
        type: 'array',
        describe: 'A list of form factors for the test run.',
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
    })
  ),
  handler: TestRunner.start,
};

module.exports = cli;
