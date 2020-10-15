const { accessibility } = require('../../../../src/commands/validates');

describe('index', () => {
  it('should export the accessibility function', () => {
    expect(accessibility).toBeDefined();
  });
});
