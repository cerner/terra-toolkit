module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/src/*.js',
    'packages/**/src/*.jsx',
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
  moduleDirectories: [
    'packages',
    'node_modules',
  ],
};
