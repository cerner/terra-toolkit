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

    const result = toBeAccessible();

    expect(result.pass).toBe(true);
  });

  it('should not pass if accessibility violations are found', () => {
    runAxe.mockImplementationOnce(() => ({
      result: {
        violations: ['Mock Violation 1'],
      },
    }));

    const result = toBeAccessible();

    expect(result.pass).toBe(false);
  });

  it('should return a message function that indicates the reason for the assertion failure', () => {
    runAxe.mockImplementationOnce(() => ({
      result: {
        violations: [],
      },
    }));

    const result = toBeAccessible();

    expect(result.message()).toEqual('expected no accessibility violations but received []');
  });
});
