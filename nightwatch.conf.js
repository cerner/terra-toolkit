const path = require('path');
const nightwatchConfig = require('./lib/nightwatch/nightwatch.config.js').default;
const webpackConfig = require('./tests/test.config.js');

const testPath = path.join('tests', 'nightwatch');
const config = nightwatchConfig(webpackConfig, testPath);

module.exports = config;
