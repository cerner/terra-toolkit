const viewportHelpers = require('../../../src/commands/viewport-helpers');
const wdioConfig = require('../../../src/config/wdio.conf');

const mockSetWindowSize = jest.fn();

global.browser = {
  setWindowSize: mockSetWindowSize,
  config: {
    terraViewports: wdioConfig.config.terraViewports,
  },
};

describe('Viewport', () => {
  it('should get all viewports', () => {
    const viewports = viewportHelpers.getViewports();

    expect(viewports[0]).toEqual(wdioConfig.config.terraViewports.tiny);
    expect(viewports[1]).toEqual(wdioConfig.config.terraViewports.small);
    expect(viewports[2]).toEqual(wdioConfig.config.terraViewports.medium);
    expect(viewports[3]).toEqual(wdioConfig.config.terraViewports.large);
    expect(viewports[4]).toEqual(wdioConfig.config.terraViewports.huge);
    expect(viewports[5]).toEqual(wdioConfig.config.terraViewports.enormous);
  });

  it('should get specified viewport', () => {
    const viewports = viewportHelpers.getViewports('tiny');

    expect(viewports.length).toEqual(1);
    expect(viewports[0]).toEqual(wdioConfig.config.terraViewports.tiny);
  });

  it('should set specified viewport', () => {
    const { width, height } = wdioConfig.config.terraViewports.tiny;

    viewportHelpers.setViewport('tiny');

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });

  it('should set default huge viewport', () => {
    const { width, height } = wdioConfig.config.terraViewports.huge;

    viewportHelpers.setViewport();

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });
});
