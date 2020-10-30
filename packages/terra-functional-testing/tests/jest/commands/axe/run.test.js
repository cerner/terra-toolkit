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

    const TerraService = () => { };

    global.browser = {
      execute: () => true,
      executeAsync: mockExecuteAsync,
      options: {
        services: [[TerraService]],
      },
    };

    global.axe = {
      run: mockAxeRun,
    };

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

    const TerraService = () => { };

    global.browser = {
      execute: () => true,
      executeAsync: mockExecuteAsync,
      options: {
        services: [[TerraService]],
      },
    };

    global.axe = {
      run: mockAxeRun,
    };

    runAxe();

    expect(mockAxeRun).toHaveBeenCalled();
  });

  it('should run axe with the service options', () => {
    const TerraService = () => { };
    const serviceOptions = { axe: { rules: { 'mock-rule': { enabled: true } } } };

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
      options: {
        services: [[TerraService, serviceOptions]],
      },
    };

    runAxe();

    expect.assertions(1);
  });

  it('should run axe with the options provided', () => {
    const TerraService = () => { };
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
      options: {
        services: [[TerraService]],
      },
    };

    runAxe({ rules: { 'mock-rule': { enabled: true } } });

    expect.assertions(1);
  });

  it('should run axe with merged rules from the service and from options provided', () => {
    const TerraService = () => { };
    const serviceOptions = { axe: { rules: { 'mock-rule-1': { enabled: true } } } };

    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      const { rules } = opts;

      const expectedRules = {
        'mock-rule-1': { enabled: true },
        'mock-rule-2': { enabled: true },
        'scrollable-region-focusable': { enabled: false },
      };

      expect(rules).toEqual(expectedRules);
      return {};
    });

    global.browser = {
      execute: jest.fn(),
      executeAsync: mockExecuteAsync,
      options: {
        services: [[TerraService, serviceOptions]],
      },
    };

    runAxe({ rules: { 'mock-rule-2': { enabled: true } } });

    expect.assertions(1);
  });
});
