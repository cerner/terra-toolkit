const { setViewport, setViewportSize } = require('../../../../src/commands/utils');
const { TERRA_VIEWPORTS } = require('../../../../src/constants');

jest.mock('../../../../src/commands/utils/setViewportSize');

describe('setViewport', () => {
  it('should set specified viewport', async () => {
    const tinyViewport = TERRA_VIEWPORTS.tiny;

    await setViewport('tiny');

    expect(setViewportSize).toHaveBeenCalledWith(tinyViewport);
  });

  it('should not set the window size for unsupported viewport', async () => {
    await setViewport('unsupported-viewport');

    expect(setViewportSize).not.toHaveBeenCalled();
  });
});
