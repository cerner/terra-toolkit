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

  it('should log message for unsupported viewport', () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => { });

    viewportHelpers.setViewport('unsupported-viewport');

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith('[ERROR] [terra-functional-testing:wdio-terra-service] The unsupported-viewport formFactor supplied is not a viewport size supported by Terra.');
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
