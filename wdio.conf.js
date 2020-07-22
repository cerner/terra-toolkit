const path = require('path');
const defaultWdioConfig = require('./packages/terra-functional-testing/lib/config/wdio.conf');

const wdioConfig = defaultWdioConfig.config;

const travis = process.env.TRAVIS;

if (travis) {
  wdioConfig.hostname = 'localhost';
}

exports.config = wdioConfig;
