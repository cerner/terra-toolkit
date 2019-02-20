const wdioConf = require('./config/wdio/wdio.conf');
const webpackConfig = require('./tests/test.config.js');

const config = {
  ...wdioConf.config,

  // Configuration for ServeStaticService
  webpackConfig,
};

exports.config = config;
