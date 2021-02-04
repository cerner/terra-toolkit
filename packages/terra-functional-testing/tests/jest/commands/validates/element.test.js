const { accessibility, element, screenshot } = require('../../../../src/commands/validates');

jest.mock('../../../../src/commands/validates/accessibility');
jest.mock('../../../../src/commands/validates/screenshot');

describe('element', () => {
  it('should run element with default options', () => {
    element('test-name');

    expect(accessibility).toHaveBeenCalledWith({ rules: undefined });
    expect(screenshot).toHaveBeenCalledWith('test-name', { mismatchTolerance: undefined, selector: undefined });
  });

  it('should throw error when no test name is provided', () => {
    try {
      element();
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:element] Terra.validate.element requires a unique test name as the first argument.');
    }
  });

  it('should throw error when an empty test name is provided', () => {
    try {
      element('');
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:element] Terra.validate.element requires a unique test name as the first argument.');
    }
  });

  it('should throw error when a non-empty test name is provided', () => {
    try {
      element({});
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:element] Terra.validate.element requires a unique test name as the first argument.');
    }
  });

  it('should run element with full options', () => {
    element('test-name', {
      rules: { 'mock-rule': { enabled: false } },
      selector: 'mock-selector',
      mismatchTolerance: 10,
    });

    expect(accessibility).toHaveBeenCalledWith({ rules: { 'mock-rule': { enabled: false } } });
    expect(screenshot).toHaveBeenCalledWith('test-name', { mismatchTolerance: 10, selector: 'mock-selector' });
  });
});
