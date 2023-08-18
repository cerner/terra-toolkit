const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  testEnvironment: './lib/JestEnvironmentJsdomTerra.js',
  transform: {
    '^.+\\.(js|jsx)$': './lib/jestBabelTransform',
  },
};
