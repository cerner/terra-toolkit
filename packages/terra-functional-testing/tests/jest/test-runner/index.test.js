const { TestRunner, defaultConfig } = require('../../../lib/test-runner');

describe('index', () => {
  it('should export the test runner', () => {
    expect(TestRunner).toBeDefined();
  });

  it('should export the default config', () => {
    expect(defaultConfig).toBeDefined();
  });
});
