// eslint-disable-next-line import/no-extraneous-dependencies
const SeleniumDockerService = require('./lib/wdio/services').SeleniumDocker;
const wdioConf = require('./lib/wdio/conf');
const localIP = require('ip');

const staticServerPort = 4567;

const config = {
  baseUrl: `http://${localIP.address()}:${staticServerPort}`,

  staticServerPort,
  staticServerLog: false,
  staticServerFolders: [
    { mount: '/', path: './tests/fixtures' },
  ],

  seleniumDocker: {
    enabled: !process.env.TRAVIS,
    cleanup: true,
  },
  ...wdioConf.config,
};


config.services = wdioConf.config.services.concat(['static-server', SeleniumDockerService]);
exports.config = config;
