const jestConfig = require('@cerner/jest-config-terra');

module.exports = {
  ...jestConfig,
  watchPathIgnorePatterns: [
    './tests/jest/reports/results/terra-functional-testing.json',
  ],
  // testEnvironment: '@cerner/jest-config-terra/lib/JestEnvironmentJsdomTerra.js',
  transform: {
    '^.+\\.(js|jsx)$': '@cerner/jest-config-terra/lib/jestBabelTransform',
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};

