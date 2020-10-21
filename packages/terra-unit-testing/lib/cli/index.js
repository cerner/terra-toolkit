const { run } = require('jest-cli/build/cli');
const path = require('path');

module.exports.run = () => {
  let argv = process.argv.slice(2);
  if (!argv.includes('--config') && !argv.includes('-c')) {
    argv = process.argv.slice(2).concat(['--config', path.join(__dirname, '..', '..', 'config', 'jest.config.js')]);
  }
  run(argv);
};
