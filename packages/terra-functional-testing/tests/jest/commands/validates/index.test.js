const { accessibility, element, screenshot } = require('../../../../src/commands/validates');

describe('index', () => {
  it('should export the accessibility function', () => {
    expect(accessibility).toBeDefined();
  });

  it('should export the element function', () => {
    expect(element).toBeDefined();
  });

  it('should export the screenshot function', () => {
    expect(screenshot).toBeDefined();
  });
});
