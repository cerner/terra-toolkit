const setViewport = require('../../../../src/commands/utils/setViewport');
const { TERRA_VIEWPORTS } = require('../../../../src/constants');

const mockSetWindowSize = jest.fn();

global.browser = {
  setWindowSize: mockSetWindowSize,
};

describe('setViewport', () => {
  it('should set specified viewport', () => {
    const { width, height } = TERRA_VIEWPORTS.tiny;

    setViewport('tiny');

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });

  it('should not set the window size for unsupported viewport', () => {
    setViewport('unsupported-viewport');

    expect(global.browser.setWindowSize).not.toHaveBeenCalled();
  });
});
