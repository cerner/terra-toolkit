jest.mock('../../scripts/serve/serve-static');
jest.mock('../../scripts/serve/serve');
jest.mock('express');
jest.mock('webpack');

const shell = require('shelljs');
const commander = require('../../scripts/serve/serve-static-cli');
const serveStatic = require('../../scripts/serve/serve-static');
const serve = require('../../scripts/serve/serve');
const express = require('express');
const webpack = require('webpack');

console.log(commander)
describe('aggregates translations messages', () => {
  beforeAll(() => {
    shell.exec('npm run start-static');

    // commander.parse(['node', 'npm', 'serve-static']);
  });

  it('returns the default cli values', () => {
    console.log('here')
    expect(serveStatic).toBeCalled();

    // expect(commander).toHaveProperty('host', '0.0.0.0');
    // expect(commander).toHaveProperty('pt', {});
  });
});

// --config [path]', 'The webpack config to serve. Alias for <config>.', undefined)
//   .option('--port [number]', 'The port the app should listen on', parseInt)
//   .option('--host [string]', 'Sets the host that the server will listen on. eg. \'10.10.10.1\'', '0.0.0.0')
//   .option('-p, --production', 'Passes the -p flag to the webpack config, if available.')
//   .option('--site [path]', 'The relative path to the static site. This takes precidence over webpack config if both are passed.', undefined)
//   .option('--disk', 'The webpack assets will be written to disk instead of a virtual file system.')
//   .parse(process.argv);