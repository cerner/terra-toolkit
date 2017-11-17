// eslint-disable-next-line import/no-extraneous-dependencies
const wdioConf = require('./lib/wdio/conf');
const localIP = require('ip');
const path = require('path');

const staticServerPort = 4567;

const config = {
  baseUrl: `http://${localIP.address()}:${staticServerPort}`,
  staticServerPort,
  staticServerLog: false,
  staticServerFolders: [
    { mount: '/', path: path.join('.', 'tests', 'fixtures') },
  ],

  seleniumDocker: {
    enabled: !process.env.TRAVIS,
    cleanup: false,
    env: {
      TZ: 'America/Chicago',
    },
  },
  ...wdioConf.config,
};


config.services = wdioConf.config.services.concat(['static-server']);
exports.config = config;
