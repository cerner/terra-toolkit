const nightwatchConfig = require('../lib/nightwatch/nightwatch.config.js').default;
const webpackConfig = require('./test.config.js');

// Allows one to specify port number in configuration
const config = nightwatchConfig(webpackConfig, ['tests/nightwatch/'], 9000);

module.exports = config;
