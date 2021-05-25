jest.mock('@cerner/terra-cli/lib/utils/Logger');

const { hideInputCaret } = require('../../../../src/commands/utils');

describe('hideInputCaret', () => {
  it('should hide caret on selector', () => {
    const mockIsExisting = jest.fn().mockImplementation(() => true);
    const element = {
      isExisting: mockIsExisting,
    };

    const mockFindElement = jest.fn().mockImplementation(() => element);
    const mockExecute = jest.fn();
    global.browser = {
      $: mockFindElement,
      execute: mockExecute,
    };

    hideInputCaret('body');

    expect(mockExecute).toHaveBeenCalledWith('document.querySelector("body").style.caretColor = "transparent";');
  });

  it('should log message when selector is not found', () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => { });
    const mockIsExisting = jest.fn().mockImplementation(() => false);
    const element = {
      isExisting: mockIsExisting,
    };
    const mockFindElement = jest.fn().mockImplementation(() => element);
    const mockExecute = jest.fn();
    global.browser = {
      $: mockFindElement,
      execute: mockExecute,
    };

    hideInputCaret('test-selector');

    expect(mockExecute).not.toHaveBeenCalled();
  });
});
