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
  handler: async (options) => {
    await TestRunner.run(options);
  },
};

module.exports = cli;
