#!/usr/bin/env node

const commander = require('commander');
const cleanScreenshots = require('./clean-screenshots');
const packageJson = require('../../package.json');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--removeReference', 'Whether or not to remove the reference screenshots', false)
  .parse(process.argv);

const {
  removeReference,
} = commander;

cleanScreenshots({ removeReference });
