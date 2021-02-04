const AccessibilityReporter = require('../../../../src/reporters/accessibility-reporter');

describe('Accessibility Reporter Index', () => {
  it('should export the the accessibility reporter', () => {
    expect(AccessibilityReporter).toBeDefined();
  });
});
