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

  it('should log message for unsupported viewport', () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => { });

    viewportHelpers.setViewport('unsupported-viewport');

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith('[ERROR] [terra-functional-testing:wdio-terra-service] The unsupported-viewport formFactor supplied is not a viewport size supported by Terra.');
  });

  it('should describe viewport', () => {
    const mockBefore = jest.fn();
    const mockDescribe = jest.fn();
    const mockAfter = jest.fn();

    global.before = mockBefore;
    global.describe = mockDescribe;
    global.after = mockAfter;

    global.Terra = {
      serviceOptions: {
        formFactor: 'tiny',
      },
    };

    viewportHelpers.describeViewports('viewport', ['tiny', 'large'], () => {});

    expect(global.describe).toHaveBeenCalled();
  });
});
