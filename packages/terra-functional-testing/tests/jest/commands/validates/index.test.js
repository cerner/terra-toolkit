const { accessibility, element } = require('../../../../src/commands/validates');

describe('index', () => {
  it('should export the accessibility function', () => {
    expect(accessibility).toBeDefined();
  });

  it('should export the element function', () => {
    expect(element).toBeDefined();
  });
});
