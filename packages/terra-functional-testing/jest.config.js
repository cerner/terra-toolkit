const jestConfig = require('@cerner/jest-config-terra');

module.exports = {
  ...jestConfig,
  watchPathIgnorePatterns: [
    './tests/jest/reports/results/terra-functional-testing.json',
  ],
};
