const injectAxe = require('../../../../src/commands/axe/inject');
const runAxe = require('../../../../src/commands/axe/run');

jest.mock('../../../../src/commands/axe/inject');

describe('Run Axe', () => {
  it('should inject axe if not already available', () => {
    const mockAxeRun = jest.fn().mockImplementation((_document, _opts, func) => {
      func(jest.fn(), jest.fn());
    });

    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      func(opts, jest.fn());
      return {};
    });

    global.browser = {
      execute: () => true,
      executeAsync: mockExecuteAsync,
    };

    global.axe = {
      run: mockAxeRun,
    };

    global.Terra = { axe: { rules: { 'scrollable-region-focusable': { enabled: false } } } };

    runAxe();

    const expectedRules = { rules: [{ enabled: false, id: 'scrollable-region-focusable' }] };

    expect(injectAxe).toHaveBeenCalledWith(expectedRules);
  });

  it('should run axe on the document', () => {
    const mockAxeRun = jest.fn().mockImplementation((_document, opts, func) => {
      func(jest.fn(), jest.fn());
    });
    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      func(opts, jest.fn());
      return {};
    });

    global.browser = {
      execute: () => true,
      executeAsync: mockExecuteAsync,
    };

    global.Terra = { axe: { rules: {} } };

    global.axe = {
      run: mockAxeRun,
    };

    runAxe();

    expect(mockAxeRun).toHaveBeenCalled();
  });

  it('should run axe with the service options', () => {
    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      const { rules } = opts;

      expect(rules).toEqual({ 'mock-rule': { enabled: true } });
      return {};
    });

    global.browser = {
      execute: jest.fn(),
      executeAsync: mockExecuteAsync,
    };

    global.Terra = { axe: { rules: { 'mock-rule': { enabled: true } } } };

    runAxe();

    expect.assertions(1);
  });

  it('should run axe with the options provided', () => {
    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      const { rules } = opts;

      const expectedRules = {
        'mock-rule': { enabled: true },
        'scrollable-region-focusable': { enabled: false },
      };

      expect(rules).toEqual(expectedRules);
      return {};
    });

    global.browser = {
      execute: jest.fn(),
      executeAsync: mockExecuteAsync,
    };

    global.Terra = { axe: { rules: { 'scrollable-region-focusable': { enabled: false } } } };

    runAxe({ rules: { 'mock-rule': { enabled: true } } });

    expect.assertions(1);
  });

  it('should run axe with merged rules from the service and from options provided', () => {
    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      const { rules } = opts;

      const expectedRules = {
        'mock-rule-1': { enabled: true },
        'mock-rule-2': { enabled: true },
      };

      expect(rules).toEqual(expectedRules);
      return {};
    });

    global.browser = {
      execute: jest.fn(),
      executeAsync: mockExecuteAsync,
    };

    global.Terra = { axe: { rules: { 'mock-rule-1': { enabled: true } } } };

    runAxe({ rules: { 'mock-rule-2': { enabled: true } } });

    expect.assertions(1);
  });
});
