import fse from 'fs-extra';
import VisualRegressionLauncher from '../../../../src/services/wdio-visual-regression-service/VisualRegressionLauncher';
import LocalCompare from '../../../../src/services/wdio-visual-regression-service/methods/LocalCompare';
import getTerraFormFactor from '../../../../src/services/wdio-visual-regression-service/modules/getTerraFormFactor';

jest.mock('../../../../src/services/wdio-visual-regression-service/modules/getTerraFormFactor');
jest.mock('fs-extra');

describe('VisualRegressionLauncher', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('VisualRegressionLauncher constructor', () => {
    it('initializes with the compare method', () => {
      const service = new VisualRegressionLauncher();

      expect(service.compare).toBeInstanceOf(LocalCompare);
    });

    it('initializes internal vars', () => {
      const service = new VisualRegressionLauncher();

      expect(service.context).toBeNull();
      expect(service.currentSuite).toBeNull();
      expect(service.currentTest).toBeNull();
    });

    it('should initialize with populated config', () => {
      const launcherOptions = {
        launcherOptions: {
          locale: 'fr',
          theme: 'lowlight-theme',
          updateScreenshots: true,
        },
      };

      const service = new VisualRegressionLauncher({}, {}, launcherOptions);

      expect(service.compare.locale).toBe('fr');
      expect(service.compare.theme).toBe('lowlight-theme');
      expect(service.compare.updateScreenshots).toBe(true);
    });
  });

  describe('VisualRegressionLauncher.before', () => {
    const service = new VisualRegressionLauncher({});

    beforeAll(() => {
      global.browser = {
        execute: jest.fn(),
        addCommand: jest.fn(),
      };
    });

    afterAll(() => {
      global.browser = {};
    });

    it('determines the capabilities', async () => {
      expect(service.context).toBeNull();
      const capabilities = { browserName: 'chrome' };
      await service.before(capabilities, []);

      expect(service.context).toHaveProperty('desiredCapabilities', {
        browserName: 'chrome',
      });
    });

    it('adds the screenshot commands to the global browser object', async () => {
      await service.before({}, []);

      expect(global.browser.addCommand).toHaveBeenNthCalledWith(1, 'checkElement', expect.any(Function));
    });
  });

  describe('VisualRegressionLauncher Suite hooks', () => {
    const service = new VisualRegressionLauncher({});

    it('VisualRegressionLauncher.beforeSuite hook', () => {
      expect(service.currentSuite).toBeNull();
      service.beforeSuite('test-suite');
      expect(service.currentSuite).toEqual('test-suite');
    });

    it('VisualRegressionLauncher.afterSuite hook', () => {
      service.afterSuite();
      expect(service.currentSuite).toBeNull();
    });
  });

  describe('VisualRegressionLauncher Test hooks', () => {
    const service = new VisualRegressionLauncher({});
    beforeAll(() => {
      global.browser = {
        execute: jest.fn(),
        addCommand: jest.fn(),
        saveScreenshot: jest.fn(),
        config: {
          launcherOptions: {
            formFactor: 'small',
          },
        },
      };
    });

    afterAll(() => {
      global.browser = {};
    });

    it('VisualRegressionLauncher.beforeTest hook', () => {
      expect(service.currentTest).toBeNull();
      service.beforeTest('test');
      expect(service.currentTest).toEqual('test');
    });

    it('VisualRegressionLauncher.afterTest hook passed test', () => {
      service.context = { desiredCapabilities: { browserName: 'chrome' } };
      service.compare = {
        getScreenshotPaths: jest.fn().mockReturnValue({ errorPath: '/fake/path' }),
      };
      service.afterTest({ test: { name: 'name' } }, {}, { passed: true });
      expect(fse.ensureFileSync).not.toHaveBeenCalled();
      expect(global.browser.saveScreenshot).not.toHaveBeenCalled();
      expect(service.currentTest).toBeNull();
    });

    it('VisualRegressionLauncher.afterTest hook failed test', () => {
      const errorPath = '/fake/path';
      service.context = { desiredCapabilities: { browserName: 'chrome' } };
      service.compare = {
        getScreenshotPaths: jest.fn().mockReturnValue({ errorPath }),
      };
      service.afterTest({ test: { name: 'name' } }, {}, { passed: false });
      expect(fse.ensureFileSync).toHaveBeenCalledWith(errorPath);
      expect(global.browser.saveScreenshot).toHaveBeenCalledWith(errorPath);
      expect(service.currentTest).toBeNull();
    });
  });

  describe('VisualRegressionLauncher.wrapCommand', () => {
    const service = new VisualRegressionLauncher({});
    const mockCommand = jest.fn().mockReturnValue('mock screenshot');
    const mockSelector = '[data-test-content]';
    const mockArgs = { name: 'mock' };

    afterAll(() => {
      global.browser = {};
    });

    it('returns async function when executed', () => {
      const wrappedCommand = service.wrapCommand(global.browser, mockCommand);
      expect(wrappedCommand).toBeInstanceOf(Function);
    });

    it('when executing wrapped command and is a desktop run', async () => {
      global.browser.isMobile = false;
      getTerraFormFactor.mockReturnValue('huge');
      service.compare = {
        processScreenshot: jest.fn().mockReturnValue('mocked screenshot results'),
      };

      // ensure binding behaves as expected
      service.context = { desiredCapabilities: { browserName: 'chrome' } };
      service.beforeSuite('test-suite');
      service.beforeTest('test');

      const expectedScreenshotContext = {
        desiredCapabilities: { browserName: 'chrome' },
        suite: 'test-suite',
        test: 'test',
        meta: {
          currentFormFactor: 'huge',
        },
        options: {
          name: 'mock',
        },
      };

      const wrappedCommand = service.wrapCommand(global.browser, mockCommand);
      const results = await wrappedCommand(mockSelector, mockArgs);

      expect(getTerraFormFactor).toHaveBeenCalled();
      expect(mockCommand).toHaveBeenCalledWith(global.browser, mockSelector, mockArgs);
      expect(service.compare.processScreenshot).toHaveBeenCalledWith(expectedScreenshotContext, 'mock screenshot');
      expect(results).toBe('mocked screenshot results');
    });

    it('when executing wrapped command and is a mobile run', async () => {
      global.browser = {
        getOrientation: jest.fn().mockReturnValue('landscape'),
        isMobile: true,
      };
      service.compare = {
        processScreenshot: jest.fn().mockReturnValue('mocked screenshot results'),
      };

      // ensure binding behaves as expected
      service.context = { desiredCapabilities: { browserName: 'firefox' } };
      service.beforeSuite('test-suite2');
      service.beforeTest('test2');

      const expectedScreenshotContext = {
        desiredCapabilities: { browserName: 'firefox' },
        suite: 'test-suite2',
        test: 'test2',
        meta: {
          currentFormFactor: 'landscape',
        },
        options: {
          name: 'mock',
        },
      };

      const wrappedCommand = service.wrapCommand(global.browser, mockCommand);
      const results = await wrappedCommand(mockSelector, mockArgs);

      expect(global.browser.getOrientation).toHaveBeenCalled();
      expect(mockCommand).toHaveBeenCalledWith(global.browser, mockSelector, mockArgs);
      expect(service.compare.processScreenshot).toHaveBeenCalledWith(expectedScreenshotContext, 'mock screenshot');
      expect(results).toBe('mocked screenshot results');
    });
  });
});
