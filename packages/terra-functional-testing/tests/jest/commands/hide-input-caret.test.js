const hideInputCaret = require('../../../src/commands/hide-input-caret');

describe('hideInputCaret', () => {
  it('should hide caret on selector', () => {
    const mockExecute = jest.fn();
    global.browser = {
      execute: mockExecute,
    };

    hideInputCaret('body');

    expect(mockExecute).toHaveBeenCalledWith('document.querySelector("body").style.caretColor = "transparent";');
  });
});
