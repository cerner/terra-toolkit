const dispatchCustomEvent = require('../../../../src/commands/utils/dispatchCustomEvent');

describe('dispatchCustomEvent', () => {
  it('execute a specified function via browser.execute', () => {
    const mockFn = jest.fn();
    global.browser = {
      execute: mockFn,
    };

    dispatchCustomEvent('mock', 'mock');
    expect(mockFn).toBeCalled();
  });

  it('throws an error outputted via browser.execute', () => {
    const mockError = new Error('mock error');
    global.browser = {
      execute: () => { throw mockError; },
    };

    const mockFn = jest.fn();
    expect(() => dispatchCustomEvent(mockFn)).toThrow(`dispatchCustomEvent failed: ${mockError}`);
  });
});
