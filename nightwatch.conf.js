const nightwatchConfig = require('./lib/nightwatch/nightwatch.config.js').default;
const webpackConfig = require('./tests/test.config.js');
const getTestDirectories = require('./src/nightwatch/monorepo-helpers.js').getTestDirectories;

const srcFolders = getTestDirectories(process.cwd());
const config = nightwatchConfig(webpackConfig, srcFolders);

module.exports = config;
