jest.mock('../../../src/commands/inject-axe');
const runAxe = require('../../../src/commands/run-axe');

describe('Run Axe', () => {
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
    const serviceOptions = { axe: { rules: [{ id: 'mock-rule', enabled: true }] } };

    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      const { rules } = opts;

      expect(rules).toEqual({ 'mock-rule': { enabled: true, id: 'mock-rule' } });
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

      expect(rules).toEqual({ 'mock-rule': { enabled: true, id: 'mock-rule' } });
      return {};
    });

    global.browser = {
      execute: jest.fn(),
      executeAsync: mockExecuteAsync,
      options: {
        services: [[TerraService]],
      },
    };

    runAxe({ rules: { 'mock-rule': { enabled: true, id: 'mock-rule' } } });

    expect.assertions(1);
  });

  it('should run axe with merged rules from the service and from options provided', () => {
    const TerraService = () => { };
    const serviceOptions = { axe: { rules: [{ id: 'mock-rule-1', enabled: true }] } };

    const mockExecuteAsync = jest.fn().mockImplementation((func, opts) => {
      const { rules } = opts;

      expect(rules).toEqual({ 'mock-rule-1': { enabled: true, id: 'mock-rule-1' }, 'mock-rule-2': { enabled: true, id: 'mock-rule-2' } });
      return {};
    });

    global.browser = {
      execute: jest.fn(),
      executeAsync: mockExecuteAsync,
      options: {
        services: [[TerraService, serviceOptions]],
      },
    };

    runAxe({ rules: { 'mock-rule-2': { enabled: true, id: 'mock-rule-2' } } });

    expect.assertions(1);
  });
});
