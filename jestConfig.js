module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'config/webpack/*.js',
    'scripts/aggregate-translations/**/*.js',
  ],
  coverageDirectory: 'tests/jest/reports/coverage',
  coverageReporters: [
    'html',
    'lcov',
    'cobertura',
    'text-summary',
  ],
  testMatch: [
    '**/jest/**/(*.)(spec|test).js?(x)',
  ],
  roots: [process.cwd()],
  testURL: 'http://localhost',
};
