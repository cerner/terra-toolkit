const TestRunner = require('./test-runner');

const cli = {
  command: 'wdio',
  describe: 'Run wdio tests',
  builder: (yargs) => (
    yargs.options({
      c: {
        type: 'string',
        alias: 'configuration',
        describe: 'A file path to the test runner configuration.',
      },
    })
  ),
  handler: TestRunner.run,
};

module.exports = cli;
