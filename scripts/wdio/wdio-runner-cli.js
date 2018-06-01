#!/usr/bin/env node

const commander = require('commander');
const getWdioConfigPath = require('./getWdioConfigPath');
const cleanScreenshots = require('./clean-screenshots');
const runner = require('./wdio-runner');

const packageJson = require('../../package.json');

// WDIO ALLOWED ARGUMENTS... Do we want to wrap. My vote, no. IF YES, the args we might support are commented below.
// const ALLOWED_ARGV = [
//   'host', 'port', 'path', 'user', 'key', 'logLevel', 'coloredLogs', 'screenshotPath',
//   'baseUrl', 'waitforTimeout', 'framework', 'reporters', 'suite', 'spec', 'cucumberOpts',
//   'jasmineOpts', 'mochaOpts', 'connectionRetryTimeout', 'connectionRetryCount', 'watch',
// ];

const listOptions = list => (
  // eslint-disable-next-line no-useless-escape
  list.replace(/[\[\]\s]/g, '').split(',').map(String)
);

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The wdio config for the tests. Alias for <config>.', undefined)
  .option('--formFactors <list>', 'The relative path to the static site. This takes precidence over webpack config if both are passed.', listOptions, undefined)
  .option('--locales <list>', 'The webpack assets will be written to disk instead of a virtual file system.', listOptions, ['en'])
  .option('--useSeleniumGrid', 'The webpack assets will be written to disk instead of a virtual file system.', false)
  .option('--host <path>', 'Selenium server host address', undefined)
  .option('--port <path>', 'Selenium server port', undefined)
  .option('-b, --baseUrl <path>', 'shorten url command calls by setting a base url', undefined)
  .option('--suite <path>', 'runs the defined suite, can be combined with --spec', undefined)
  .option('--spec <path>', 'runs a certain spec file, can be combined with --suite - overrides specs piped from stdin', listOptions, undefined)
  .option('--continueOnFail', 'Continue test runs when a run fails.')
  .option('--updateReference', 'runs a certain spec file, can be combined with --suite - overrides specs piped from stdin', false)
  .parse(process.argv);

const {
  continueOnFail,
  config,
  formFactors,
  locales,
  useSeleniumGrid,
  host,
  port,
  baseUrl,
  suite,
  spec,
  updateReference,
} = commander;

const configPath = getWdioConfigPath(config);

cleanScreenshots(configPath, updateReference);

runner({
  // terra-toolkit wdio runner options
  continueOnFail,
  configPath,
  formFactors,
  locales,
  useSeleniumGrid,
  // wdio cli options
  ...host && { host },
  ...port && { port },
  ...baseUrl && { baseUrl },
  ...spec && { spec },
  ...suite && { suite },
});
