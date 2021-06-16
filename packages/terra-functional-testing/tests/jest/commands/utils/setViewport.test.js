const { setViewport, setViewportSize } = require('../../../../src/commands/utils');
const { TERRA_VIEWPORTS } = require('../../../../src/constants');

jest.mock('../../../../src/commands/utils/setViewportSize');

describe('setViewport', () => {
  it('should set specified viewport', () => {
    const tinyViewport = TERRA_VIEWPORTS.tiny;

    setViewport('tiny');

    expect(setViewportSize).toHaveBeenCalledWith(tinyViewport);
  });

  it('should not set the window size for unsupported viewport', () => {
    setViewport('unsupported-viewport');

    expect(setViewportSize).not.toHaveBeenCalled();
  });
});
