const WdioTerraService = require('../../../src/services/wdio-terra-service');
const { setViewport } = require('../../../src/commands/viewport-helpers');

jest.mock('../../../src/commands/viewport-helpers');

const mockIsExisting = jest.fn().mockImplementation(() => true);
const element = {
  waitForExist: () => {},
  isExisting: mockIsExisting,
};

const mockFindElement = jest.fn().mockImplementation(() => element);
const TerraService = () => { };
const serviceOptions = { formFactor: 'huge' };

global.browser = {
  $: mockFindElement,
  options: {
    services: [[TerraService, serviceOptions]],
  },
  config: {
    waitforTimeout: 10000,
  },
};

describe('WDIO Terra Service', () => {
  it('should setup the global terra validates accessibility command', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'chrome' });

    expect(global.Terra.validates.accessibility).toBeDefined();
  });

  it('should setup the global terra validates element command', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'chrome' });

    expect(global.Terra.validates.element).toBeDefined();
  });

  it('should setup the global terra axe configuration', () => {
    const rules = {
      'scrollable-region-focusable': { enabled: false },
      'color-contrast': { enabled: true },
    };

    expect(global.Terra.axe).toEqual({ rules });
  });

  it('should disable the axe color contrast rule for lowlight theme', () => {
    const service = new WdioTerraService({ theme: 'clinical-lowlight-theme' });

    service.before({ browserName: 'chrome' });

    const rules = {
      'scrollable-region-focusable': { enabled: false },
      'color-contrast': { enabled: false },
    };

    expect(global.Terra.axe).toEqual({ rules });
  });

  it('should set the expect command as a global api', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'chrome' });

    expect(expect).toBeDefined();
  });

  it('should set viewport helper commands as as global api', () => {
    const service = new WdioTerraService({ formFactor: 'huge' });

    service.before({ browserName: 'chrome' });

    expect(setViewport).toBeCalled();
    expect(global.Terra.viewports).toBeDefined();
    expect(global.Terra.describeViewports).toBeDefined();
    expect(global.Terra.hideInputCaret).toBeDefined();
    expect(global.Terra.serviceOptions.formFactor).toBe('huge');
  });

  it('should wait for browser interaction for IE', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'internet explorer' });

    expect(mockFindElement).toHaveBeenCalledWith('body');
  });

  it('should hide input caret after command', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'chrome' });

    const mockHideInputCaret = jest.fn();
    global.Terra.hideInputCaret = mockHideInputCaret;

    service.afterCommand('url', [], 0, undefined);

    expect(mockHideInputCaret).toHaveBeenCalledWith('body');
    expect(mockFindElement).toHaveBeenCalledWith('[data-terra-test-loading]');
  });
});
