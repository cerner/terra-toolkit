const config = require('./packages/terra-unit-testing-react/config/jest.config');

config.collectCoverageFrom = [
  './**/terra-unit-testing-react/config/**/*.js',
  './**/terra-unit-testing-react/scripts/**/*.js',
  './**/terra-unit-testing-react/lib/**/*.js',
];
config.testMatch = ['**/terra-unit-testing-react/**/jest/**/(*.)(spec|test).js?(x)'];

module.exports = config;
