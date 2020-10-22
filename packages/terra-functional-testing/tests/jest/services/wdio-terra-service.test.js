const TerraService = require('../../../src/services/wdio-terra-service');
const viewportHelpers = require('../../../src/commands/viewport-helpers');

viewportHelpers.setViewport = jest.fn().mockImplementation(() => ({ }));

const mockPause = jest.fn();
const mockFindElement = jest.fn().mockImplementation(() => true);

global.browser = {
  pause: mockPause,
  $: mockFindElement,
  config: {},
};

describe('WDIO Terra Service', () => {
  it('should setup the global terra validates accessibility command', () => {
    const service = new TerraService();

    service.before({ browserName: 'chrome' });

    expect(global.Terra.validates.accessibility).toBeDefined();
  });

  it('should set the expect command as a global api', () => {
    const service = new TerraService();

    service.before({ browserName: 'chrome' });

    expect(expect).toBeDefined();
  });

  it('should set viewport helper commands as as global api', () => {
    const service = new TerraService();

    service.before({ browserName: 'chrome' });

    expect(viewportHelpers.setViewport).toBeCalled();
    expect(global.Terra.viewports).toBeDefined();
    expect(global.Terra.describeViewports).toBeDefined();
    expect(global.Terra.hideInputCaret).toBeDefined();
  });

  it('should pause for browser interaction for IE', () => {
    const service = new TerraService();

    service.before({ browserName: 'internet explorer' });

    expect(mockPause).toHaveBeenCalledWith(10000);
  });

  it('should hide input caret after command', () => {
    const service = new TerraService();

    service.before({ browserName: 'chrome' });

    const mockHideInputCaret = jest.fn();
    global.Terra.hideInputCaret = mockHideInputCaret;

    service.afterCommand('url', [], 0, undefined);

    expect(mockHideInputCaret).toHaveBeenCalledWith('body');
    expect(mockFindElement).toHaveBeenCalledWith('[data-terra-dev-site-loading]');
  });
});
