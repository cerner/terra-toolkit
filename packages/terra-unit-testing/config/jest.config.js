// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    './**/config/**/*.*',
    './**/scripts/**/*.*',
    './**/lib/**/*.*',
  ],
  coverageDirectory: `${process.cwd()}/tests/jest/reports/coverage`,
  coverageReporters: [
    'html',
    'text',
    'lcov',
    'cobertura',
    'text-summary',
  ],
  roots: [process.cwd()],
  testMatch: [
    `${process.cwd()}/**/jest/**/(*.)(spec|test).js?(x)`,
  ],
};
