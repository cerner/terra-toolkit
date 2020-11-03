const { accessibility, element } = require('../../../../src/commands/validates');

jest.mock('../../../../src/commands/validates/accessibility');

describe('element', () => {
  it('should run element with default options', () => {
    global.Terra = {
      serviceOptions: {},
    };

    element();

    expect(accessibility).toHaveBeenCalledWith({ rules: undefined });
  });

  it('should run element with full options', () => {
    global.Terra = {
      serviceOptions: {
        selector: 'mock-selector',
      },
    };

    element({
      testName: 'test-name',
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

    element({
      testName: 'test-name',
      rules: { 'mock-rule': { enabled: true } },
      misMatchTolerance: 10,
    });

    expect(accessibility).toHaveBeenCalledWith({ rules: { 'mock-rule': { enabled: true } } });
  });
});
