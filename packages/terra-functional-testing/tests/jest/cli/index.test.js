const CLI = require('../../../src/cli');

describe('index', () => {
  it('should export the test runner cli', () => {
    expect(CLI).toBeDefined();
  });

  it('should export the test runner cli run command', () => {
    expect(CLI.run).toBeDefined();
  });
});
