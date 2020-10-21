const { toBeAccessible } = require('../../../../src/commands/expect');

describe('index', () => {
  it('should export the toBeAccessible command', () => {
    expect(toBeAccessible).toBeDefined();
  });
});
