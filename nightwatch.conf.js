const nightwatchConfig = require('./lib/nightwatch/nightwatch.config.js').default;
const webpackConfig = require('./tests/test.config.js');

const config = nightwatchConfig(webpackConfig, ['/tests/nightwatch/']);

module.exports = config;
