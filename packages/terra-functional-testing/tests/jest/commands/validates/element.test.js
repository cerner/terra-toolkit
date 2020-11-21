const { accessibility, element } = require('../../../../src/commands/validates');

jest.mock('../../../../src/commands/validates/accessibility');

describe('element', () => {
  it('should run element with default options', () => {
    global.Terra = {
      serviceOptions: {},
    };

    element('test-name');

    expect(accessibility).toHaveBeenCalledWith({ rules: undefined });
  });

  it('should throw error when no test name provided', () => {
    try {
      element();
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:wdio] Terra.validate.element requires a test name as the first argument.');
    }
  });

  it('should run element with full options', () => {
    global.Terra = {
      serviceOptions: {
        selector: 'mock-selector',
      },
    };

    element('test-name', {
      rules: { 'mock-rule': { enabled: false } },
      selector: 'mock-selector',
      misMatchTolerance: 10,
    });

    expect(accessibility).toHaveBeenCalledWith({ rules: { 'mock-rule': { enabled: false } } });
  });

  it('should run element with service selector options', () => {
    global.Terra = {
      serviceOptions: {
        selector: 'mock-selector',
      },
    };

    element('test-name', {
      rules: { 'mock-rule': { enabled: true } },
      misMatchTolerance: 10,
    });

    expect(accessibility).toHaveBeenCalledWith({ rules: { 'mock-rule': { enabled: true } } });
  });
});
