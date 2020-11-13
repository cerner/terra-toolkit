jest.mock('@cerner/terra-cli/lib/utils/Logger');

const viewportHelpers = require('../../../src/commands/viewport-helpers');
const { TERRA_VIEWPORTS } = require('../../../src/static-assets/viewports');

const mockSetWindowSize = jest.fn();

global.browser = {
  setWindowSize: mockSetWindowSize,
};

describe('Viewport', () => {
  it('should get all viewports', () => {
    const viewports = viewportHelpers.getViewports();

    expect(viewports[0]).toEqual(TERRA_VIEWPORTS.tiny);
    expect(viewports[1]).toEqual(TERRA_VIEWPORTS.small);
    expect(viewports[2]).toEqual(TERRA_VIEWPORTS.medium);
    expect(viewports[3]).toEqual(TERRA_VIEWPORTS.large);
    expect(viewports[4]).toEqual(TERRA_VIEWPORTS.huge);
    expect(viewports[5]).toEqual(TERRA_VIEWPORTS.enormous);
  });

  it('should get specified viewport', () => {
    const viewports = viewportHelpers.getViewports('tiny');

    expect(viewports.length).toEqual(1);
    expect(viewports[0]).toEqual(TERRA_VIEWPORTS.tiny);
  });

  it('should set specified viewport', () => {
    const { width, height } = TERRA_VIEWPORTS.tiny;

    viewportHelpers.setViewport('tiny');

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });

  it('should set default huge viewport', () => {
    const { width, height } = TERRA_VIEWPORTS.huge;

    viewportHelpers.setViewport();

    expect(global.browser.setWindowSize).toHaveBeenCalledWith(width, height);
  });

  it('should not set the window size for unsupported viewport', () => {
    viewportHelpers.setViewport('unsupported-viewport');

    expect(global.browser.setWindowSize).not.toHaveBeenCalled();
  });

  it('should describe viewport', () => {
    const mockBeforeAll = jest.fn();
    const mockDescribe = jest.fn();
    const mockAfterAll = jest.fn();
    const TerraService = () => { };
    const serviceOptions = { formFactor: 'tiny' };

    global.beforeAll = mockBeforeAll;
    global.describe = mockDescribe;
    global.afterAll = mockAfterAll;

    global.browser.options = {
      services: [[TerraService, serviceOptions]],
    };

    viewportHelpers.describeViewports('viewport', ['tiny', 'large'], () => {});

    expect(global.describe).toHaveBeenCalled();
  });
});
