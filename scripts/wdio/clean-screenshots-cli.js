#!/usr/bin/env node

const commander = require('commander');
const getWdioConfigPath = require('./getWdioConfigPath');
const cleanScreenshots = require('./clean-screenshots');
const packageJson = require('../../package.json');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The wdio config for the tests. Alias for <config>.', undefined)
  .option('--removeReference <path>', 'runs a certain spec file, can be combined with --suite - overrides specs piped from stdin', undefined)
  .parse(process.argv);

const {
  config,
  removeReference,
} = commander;

const configPath = getWdioConfigPath(config);

cleanScreenshots(configPath, removeReference);
