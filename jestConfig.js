module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'config/webpack/*.js',
    'scripts/aggregate-themes/**/*.js',
  ],
  coverageDirectory: 'tests/jest/reports/coverage',
  coverageReporters: [
    'html',
    'text',
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
