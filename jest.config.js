const jestConfig = require('./packages/jest-config-terra');

module.exports = {
  ...jestConfig,
  testEnvironment: './packages/jest-config-terra/lib/jest-environment-jsdom-terra.js',
  setupFiles: [
    './jest.enzymeSetup.js',
  ],
  transform: {
    '^.+\\.(js|jsx)$': './packages/jest-config-terra/lib/jestBabelTransform',
  },
  snapshotSerializers: [
    './node_modules/enzyme-to-json/serializer',
  ],
};

// module.exports = {
//   collectCoverageFrom: [
//     '!packages/terra-cli/tests/**/*.js',
//     '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/commands/*.js',
//     '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/methods/(S)*.js',
//     '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/modules/(a|b|m)*.js',
//     '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/scripts/*.js',
//     '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/utils/**/*.js',
//   ],
//   modulePathIgnorePatterns: [
//     'packages/terra-cli/tests/jest/fixtures',
//     'packages/duplicate-package-checker-webpack-plugin/tests/jest',
//   ],
// };
