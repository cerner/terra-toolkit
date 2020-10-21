const config = require('./packages/terra-unit-testing/config/jest.config');

config.coveragePathIgnorePatterns = ['/node_modules/', '/packages/terra-unit-testing-react/'];
config.testPathIgnorePatterns = ['/node_modules/', '/packages/terra-unit-testing-react/'];

module.exports = config;
