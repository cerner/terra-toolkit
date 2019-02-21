module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'config/webpack/*.js',
    'scripts/aggregate-translations/**/*.js',
  ],
  setupFiles: [
    './jestsetup.js',
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
  snapshotSerializers: [
    './node_modules/enzyme-to-json/serializer',
  ],
  testURL: 'http://localhost',
};
