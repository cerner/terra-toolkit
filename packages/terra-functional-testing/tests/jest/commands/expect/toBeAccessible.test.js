const runAxe = require('../../../../src/commands/axe/run');
const toBeAccessible = require('../../../../src/commands/expect/toBeAccessible');

jest.mock('../../../../src/commands/axe/run');

describe('toBeAccessible', () => {
  it('should pass if no accessibility violations are found', () => {
    runAxe.mockImplementationOnce(() => ({
      result: {
        violations: [],
      },
    }));

    global.Terra = {
      axe: {
        rules: {},
      },
    };

    const result = toBeAccessible();

    expect(result.pass).toBe(true);
  });

  it('should not pass if accessibility violations are found', () => {
    runAxe.mockImplementationOnce(() => ({
      result: {
        violations: [{ id: 'Mock Violation 1' }],
      },
    }));

    const result = toBeAccessible();

    expect(result.pass).toBe(false);
  });

  it('should return a message function that indicates the reason for the assertion failure', () => {
    runAxe.mockImplementationOnce(() => ({
      result: {
        violations: [{ id: 'mock-violation' }],
      },
    }));

    const result = toBeAccessible();

    expect(result.message()).toMatchSnapshot();
  });

  it('should return a message function that filterers out rules set to warn', () => {
    runAxe.mockImplementationOnce(() => ({
      result: {
        violations: [{ id: 'mock-violation-1' }, { id: 'mock-violation-2' }],
      },
    }));

    global.Terra = {
      axe: {
        rules: {
          'mock-violation-1': {
            warn: true,
          },
        },
      },
    };

    const result = toBeAccessible();

    expect(result.message()).toMatchSnapshot();
  });
});
