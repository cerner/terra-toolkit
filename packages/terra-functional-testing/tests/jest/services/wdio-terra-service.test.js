const WdioTerraService = require('../../../src/services/wdio-terra-service');
const { setViewport } = require('../../../src/commands/utils');

jest.mock('../../../src/commands/utils');

const mockIsExisting = jest.fn().mockImplementation(() => true);
const element = {
  waitForExist: () => {},
  isExisting: mockIsExisting,
};

const mockFindElement = jest.fn().mockImplementation(() => element);
const TerraService = () => { };
const serviceOptions = { formFactor: 'huge' };

const config = {
  serviceOptions: {
    selector: 'mock-selector',
  },
  launcherOptions: {
    theme: 'mock-theme',
    formFactor: 'huge',
  },
};

const capabilities = { browserName: 'chrome' };

global.browser = {
  $: mockFindElement,
  options: {
    services: [[TerraService, serviceOptions]],
  },
  config: {
    waitforTimeout: 10000,
  },
};

global.Terra = {};

describe('WDIO Terra Service', () => {
  it('should setup the global terra object in before hook', () => {
    const service = new WdioTerraService({}, {}, config);

    service.before(capabilities);

    expect(global.Terra.validates.accessibility).toBeDefined();
    expect(global.Terra.validates.element).toBeDefined();
    expect(global.Terra.validates.screenshot).toBeDefined();
    expect(global.Terra.hideInputCaret).toBeDefined();
    expect(global.Terra.setApplicationLocale).toBeDefined();
    expect(setViewport).toHaveBeenCalledWith(service.serviceOptions.formFactor);
  });

  it('should setup the global terra axe configuration', () => {
    const rules = {
      'scrollable-region-focusable': { enabled: false },
      'color-contrast': { enabled: true },
    };

    expect(global.Terra.axe).toEqual({ rules });
  });

  it('should disable the axe color contrast rule for lowlight theme', () => {
    const service = new WdioTerraService({}, {}, { launcherOptions: { theme: 'clinical-lowlight-theme' } });

    service.before(capabilities);

    const rules = {
      'scrollable-region-focusable': { enabled: false },
      'color-contrast': { enabled: false },
    };

    expect(global.Terra.axe).toEqual({ rules });
  });

  it('should wait for browser interaction for IE', () => {
    const service = new WdioTerraService();

    service.before({ browserName: 'internet explorer' });

    expect(mockFindElement).toHaveBeenCalledWith('body');
  });

  it('should hide input caret after command', () => {
    const service = new WdioTerraService();

    service.before(capabilities);

    const mockHideInputCaret = jest.fn();
    global.Terra.hideInputCaret = mockHideInputCaret;

    service.afterCommand('url', [], 0, undefined);

    expect(mockHideInputCaret).toHaveBeenCalledWith('body');
    expect(mockFindElement).toHaveBeenCalledWith('[data-terra-test-loading]');
  });

  it('should define commands in beforeSession with no serviceOptions', () => {
    const service = new WdioTerraService();
    const expectedServiceOptions = {
      selector: '[data-terra-test-content] *:first-child',
    };

    service.beforeSession();
    expect(global.Terra.describeViewports).toBeDefined();
    expect(global.Terra.viewports).toBeDefined();
    expect(global.Terra.serviceOptions).toEqual(expectedServiceOptions);
  });

  it('should set service options with empty config', () => {
    const service = new WdioTerraService();
    const expectedServiceOptions = {
      selector: '[data-terra-test-content] *:first-child',
    };

    expect(service.serviceOptions).toEqual(expectedServiceOptions);
  });

  it('should set service options with populated config', () => {
    const service = new WdioTerraService({}, {}, config);
    const expectedServiceOptions = {
      formFactor: 'huge',
      selector: 'mock-selector',
      theme: 'mock-theme',
    };

    expect(service.serviceOptions).toEqual(expectedServiceOptions);
  });

  it('should define all commands', () => {
    const service = new WdioTerraService({}, {}, config);

    const expectedServiceOptions = {
      formFactor: 'huge',
      selector: 'mock-selector',
      theme: 'mock-theme',
    };

    service.beforeSession();
    service.before(capabilities);

    expect(setViewport).toBeCalled();
    expect(global.Terra.viewports).toBeDefined();
    expect(global.Terra.describeViewports).toBeDefined();
    expect(global.Terra.hideInputCaret).toBeDefined();
    expect(global.Terra.serviceOptions).toEqual(expectedServiceOptions);
  });
});
