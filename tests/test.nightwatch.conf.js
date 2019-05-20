const path = require('path');
const nightwatchConfig = require('../lib/nightwatch/nightwatch.config.js').default;
const webpackConfig = require('./test.config.js');

const testPath = path.join('tests', 'nightwatch');

// Allows one to specify port number in configuration
const config = nightwatchConfig(webpackConfig, [testPath], 9000);

module.exports = config;
