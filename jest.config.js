const jestConfig = require('./packages/jest-config-terra');

module.exports = {
  ...jestConfig,
  testEnvironment: './packages/jest-config-terra/lib/JestEnvironmentJsdomTerra.js',
  setupFiles: [
    './jest.enzymeSetup.js',
  ],
  transform: {
    '^.+\\.(js|jsx)$': './packages/jest-config-terra/lib/jestBabelTransform',
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
