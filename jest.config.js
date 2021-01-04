// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/src/**/*.js',
    '!packages/terra-cli/tests/**/*.js',
    '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/commands/*.js',
    '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/methods/(S)*.js',
    '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/modules/(a|b|m)*.js',
    '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/scripts/*.js',
    '!packages/terra-functional-testing/src/services/wdio-visual-regression-service/utils/**/*.js',
  ],
  setupFiles: [
    './jestSetup.js',
  ],
  coverageDirectory: 'tests/jest/reports/coverage',
  coverageReporters: [
    'html',
    'text',
    'lcov',
    'cobertura',
    'text-summary',
  ],
  modulePathIgnorePatterns: [
    'packages/terra-cli/tests/jest/fixtures',
  ],
  snapshotSerializers: [
    './node_modules/enzyme-to-json/serializer',
  ],
  roots: [process.cwd()],
  testMatch: [
    '**/jest/**/*.test.js?(x)',
  ],
  transform: {
    '^.+\\.(js|jsx)$': './jestBabelTransform',
  },
};
