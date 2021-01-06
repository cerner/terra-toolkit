const dispatchCustomEvent = require('../../../../src/commands/utils/dispatchCustomEvent');

describe('dispatchCustomEvent', () => {
  it('execute a specified function via browser.execute', () => {
    global.browser = {
      execute: jest.fn(),
    };

    const mockFn = jest.fn();
    dispatchCustomEvent(mockFn);
    expect(mockFn).toBeCalled();
  });
  it('throws an error outputted via browser.execute', () => {
    global.browser = {
      execute: () => { throw 'mock fail'; },
    };

    const mockFn = jest.fn();

    expect(() => dispatchCustomEvent(mockFn)).toThrow('mock fail');
  });
});
