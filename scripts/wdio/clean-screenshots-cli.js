#!/usr/bin/env node

const commander = require('commander');
const getWdioConfigPath = require('./getWdioConfigPath');
const cleanScreenshots = require('./clean-screenshots');
const packageJson = require('../../package.json');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config [path]', 'The wdio config path for the tests', undefined)
  .option('--removeReference', 'Whether or not to remove the reference screenshots', false)
  .parse(process.argv);

const {
  config,
  removeReference,
} = commander;

const configPath = getWdioConfigPath(config);

cleanScreenshots({ configPath, removeReference });
