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
      locales: {
        type: 'array',
        describe: 'A list of language locales for the test run.',
        default: ['en'],
      },
    })
  ),
  handler: TestRunner.start,
};

module.exports = cli;
