/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const nightwatchConfig = require('./lib/nightwatch/config.js').default;
const webpackConfig = require('./tests/test.config.js');

const config = Object.assign(nightwatchConfig([], webpackConfig), { src_folders: ['tests'] });

console.log(config);

module.exports = config;
