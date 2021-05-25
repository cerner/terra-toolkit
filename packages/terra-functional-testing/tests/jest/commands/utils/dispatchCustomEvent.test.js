const { dispatchCustomEvent } = require('../../../../src/commands/utils');

describe('dispatchCustomEvent', () => {
  it('executes a specified function via browser.execute', () => {
    const mockFn = jest.fn();
    global.browser = {
      execute: mockFn,
    };

    dispatchCustomEvent({ name: 'mock' });
    expect(mockFn).toBeCalled();
  });

  it('throws an error outputted by browser.execute', () => {
    const mockError = new Error('mock error');
    global.browser = {
      execute: () => { throw mockError; },
    };

    expect(() => dispatchCustomEvent({ name: 'mock' })).toThrow(`dispatchCustomEvent failed: ${mockError}`);
  });
});
