const { program } = require('commander');
const { TestRunner } = require('../test-runner');

const run = async () => {
  program
    .option('--config <path>', 'A file path to the test runner configuration.');

  program.parse(process.argv);

  TestRunner.run(program.opts());
};

module.exports = { run };
