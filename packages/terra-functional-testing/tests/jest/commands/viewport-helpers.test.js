const viewportHelpers = require('../../../src/commands/viewport-helpers');
const terraViewports = require('../../../src/util/viewports');

const mockSetWindowSize = jest.fn();

global.browser = {
  setWindowSize: mockSetWindowSize,
};

describe('Viewport', () => {
  it('should get all viewports', () => {
    const viewports = viewportHelpers.getViewports();

    expect(viewports[0]).toEqual(terraViewports.tiny);
    expect(viewports[1]).toEqual(terraViewports.small);
    expect(viewports[2]).toEqual(terraViewports.medium);
    expect(viewports[3]).toEqual(terraViewports.large);
    expect(viewports[4]).toEqual(terraViewports.huge);
    expect(viewports[5]).toEqual(terraViewports.enormous);
  });

  it('should get specified viewport', () => {
    const viewports = viewportHelpers.getViewports('tiny');

    expect(viewports.length).toEqual(1);
    expect(viewports[0]).toEqual(terraViewports.tiny);
  });

  it('should set specified viewport', () => {
    const { width, height } = terraViewports.tiny;

    viewportHelpers.setViewport('tiny');

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });

  it('should set default huge viewport', () => {
    const { width, height } = terraViewports.huge;

    viewportHelpers.setViewport();

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });
});
