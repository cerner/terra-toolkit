#!/usr/bin/env node

const commander = require('commander');
const getWdioConfigPath = require('./getWdioConfigPath');
const cleanScreenshots = require('./clean-screenshots');
const runner = require('./wdio-runner');
const parseCLIList = require('../utils/parse-cli-list');

const packageJson = require('../../package.json');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config [path]', 'The wdio config path for the tests', undefined)
  .option('--formFactors [list]', 'The list of viewport sizes to test', parseCLIList, undefined)
  .option('--locales [list]', 'The list of locales to test', parseCLIList, ['en'])
  .option('--continueOnFail', 'Wheather or not to execute all test runs when a run fails', false)
  .option('--updateReference', 'Whether or not to remove reference screenshots during screenshot cleanup', false)
  .option('--host [number]', '[wdio option] The selenium server port', undefined)
  .option('--port [string]', '[wdio option] The selenium server host address', undefined)
  .option('--baseUrl [path]', '[wdio option] The base URL', undefined)
  .option('--suite [path]', '[wdio option] The suite to run', undefined)
  .option('--spec [path]', '[wdio option] The spec file to run', undefined)
  .parse(process.argv);

const {
  continueOnFail,
  config,
  formFactors,
  locales,
  host,
  port,
  baseUrl,
  suite,
  spec,
  updateReference,
} = commander;

const configPath = getWdioConfigPath(config);

cleanScreenshots({
  configPath, updateReference,
});

runner({
  // terra-toolkit wdio runner options
  configPath,
  continueOnFail,
  formFactors,
  locales,
  // honored wdio cli options
  ...host && { host },
  ...port && { port },
  ...baseUrl && { baseUrl },
  ...spec && { spec },
  ...suite && { suite },
});
