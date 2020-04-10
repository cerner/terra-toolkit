#!/usr/bin/env node

const commander = require('commander');
const getWdioConfigPath = require('./getWdioConfigPath');
const cleanScreenshots = require('./clean-screenshots');
const runner = require('./wdio-runner');
const parseCLIList = require('../utils/parse-cli-list');

const packageJson = require('../../package.json');

commander.version(packageJson.version);

// define cli options
commander
  .option('--config [path]', 'The wdio config path for the tests. Defaults to wdio.conf.js', undefined)
  .option('--locales [list]', 'The list of locales to test. Defaults to [en]', parseCLIList, undefined)
  .option('--formFactors [list]', 'The list of viewport sizes to test.', parseCLIList, undefined)
  .option('--browsers [list]', 'The list of browsers to test. Defaults to [chrome].', parseCLIList, undefined)
  .option('--themes [list]', 'List of themes to override defined default theme.', parseCLIList, undefined)
  .option('--gridUrl [url]', 'The selenium grid url to run tests against', undefined)
  .option('--continueOnFail', 'Pass to continue executing test runs when a run fails', false)
  .option('--updateReference', 'Pass to remove all reference screenshots during screenshot cleanup', false)
  .option('--host [number]', '[wdio option] The selenium server port', undefined)
  .option('--port [string]', '[wdio option] The selenium server host address', undefined)
  .option('--baseUrl [path]', '[wdio option] The base URL', undefined)
  .option('--suite [path]', '[wdio option] The suite to run', undefined)
  .option('--spec [path]', '[wdio option] The spec file to run', undefined)
  
// create custom 
commander.on('--help', () => {
  console.log('\nSupported Environment Variables for default WDIO config:');
  console.log('  > WDIO_EXTERNAL_HOST - use to pass your host\'s IP when running wdio tests from a VM or behind a proxy');
  console.log('  > WDIO_EXTERNAL_PORT - use to to override the default host port');
  console.log('  > WDIO_INTERNAL_PORT - use to override the default container port');
  console.log('  > WDIO_BAIL -  set as \'false\' to bail fast while running locally');
  console.log('  > WDIO_IGNORE_COMPARISON_RESULTS - set to \'true\' for a dry run of the screenshot(s) comparison results');
  console.log('  > LOCALE - use to define the locale used in the wdio run');
  console.log('  > FORM_FACTOR - use to define the form factor');
  console.log('  > SITE - use to provide the packed site output path to test against');
  console.log('  > SELENIUM_GRID_URL - use to set enable running test against a hosted selenium grid');
  console.log('  > BROWSERS - use to specify the browser(s) to test');
  console.log('  > THEME - use to specify the theme to test');
});

// Parse process arguments
commander.parse(process.argv);

const {
  continueOnFail,
  config,
  gridUrl,
  browsers,
  themes,
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
  updateReference,
});

runner({
  // terra-toolkit wdio runner options
  configPath,
  continueOnFail,
  formFactors,
  locales,
  gridUrl,
  browsers,
  themes,
  // honored wdio cli options
  ...host && { host },
  ...port && { port },
  ...baseUrl && { baseUrl },
  ...spec && { spec },
  ...suite && { suite },
});
