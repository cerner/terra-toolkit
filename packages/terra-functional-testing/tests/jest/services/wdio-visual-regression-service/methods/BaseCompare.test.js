import path from 'path';

import BaseCompare from '../../../../../src/services/wdio-visual-regression-service/methods/BaseCompare';

const dirTmp = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');

const context = {
  browser: {
    name: 'chrome',
  },
  test: {
    file: path.join(dirTmp, 'test-spec.js'),
    parent: 'Test Component',
    title: 'displays a button',
  },
  meta: {
    viewport: { height: 600, width: 1000 },
  },
};

describe('BaseCompare', () => {
  it('BaseCompare.createTestName', () => {
    const baseCompare = new BaseCompare({});
    let result = baseCompare.createTestName('hello');
    expect(result).toEqual('hello');

    result = baseCompare.createTestName('hello[world]');
    expect(result).toEqual('world');

    result = baseCompare.createTestName('hello world ');
    expect(result).toEqual('hello_world');

    result = baseCompare.createTestName('hello:world?default+08.name yes');
    expect(result).toEqual('hello-world-default_08_name_yes');
  });

  describe('BaseCompare.getScreenshotName', () => {
    it('used parent + test name as screenshot name', () => {
      const baseCompare = new BaseCompare({});
      const createTestNameSpy = jest.spyOn(baseCompare, 'createTestName');

      const result = baseCompare.getScreenshotName(context);
      expect(result).toEqual('Test_Component[displays_a_button].png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, context.test.parent);
      expect(createTestNameSpy).toHaveBeenNthCalledWith(2, context.test.title);
    });

    it('uses parent + custom name screenshot name', () => {
      const baseCompare = new BaseCompare({});
      const createTestNameSpy = jest.spyOn(baseCompare, 'createTestName');
      const result = baseCompare.getScreenshotName({ ...context, options: { name: 'custom' } });
      expect(result).toEqual('Test_Component[custom].png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, context.test.parent);
      expect(createTestNameSpy).toHaveBeenNthCalledWith(2, 'custom');
    });
  });

  describe('BaseCompare.getScreenshotName', () => {
    it('returns formFactor is defined in constructor', () => {
      const baseCompare = new BaseCompare({ formFactor: 'tiny' });
      const result = baseCompare.getFormFactor(300);
      expect(result).toEqual('tiny');
    });

    it('determines formFactor from viewport width', () => {
      const baseCompare = new BaseCompare({});
      let result = baseCompare.getFormFactor(400);
      expect(result).toEqual('tiny');

      result = baseCompare.getFormFactor(500);
      expect(result).toEqual('small');

      result = baseCompare.getFormFactor(700);
      expect(result).toEqual('medium');

      result = baseCompare.getFormFactor(900);
      expect(result).toEqual('large');

      result = baseCompare.getFormFactor(1200);
      expect(result).toEqual('huge');

      result = baseCompare.getFormFactor(1500);
      expect(result).toEqual('enormous');

      // TO DO: should we fail if it's larger or not an exact terra-viewport?
      result = baseCompare.getFormFactor(30000);
      expect(result).toEqual('enormous');
    });
  });

  it('BaseCompare.getScreenshotDir', () => {
    const baseCompare = new BaseCompare({});
    const getFormFactorSpy = jest.spyOn(baseCompare, 'getFormFactor');

    const result = baseCompare.getScreenshotDir(context);
    expect(result).toEqual(path.join('terra-default-theme', 'en', 'chrome_large', 'test-spec'));
    expect(getFormFactorSpy).toHaveBeenCalledWith(1000);
  });

  describe('BaseCompare.getScreenshotPaths', () => {
    it('creates reference, latest, and diff paths with default values', () => {
      const baseCompare = new BaseCompare({
        baseScreenshotDir: process.cwd(),
        locale: 'en',
        theme: 'cerner-default-theme',
      });

      const getScreenshotDirSpy = jest.spyOn(baseCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      const getScreenshotNameSpy = jest.spyOn(baseCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const result = baseCompare.getScreenshotPaths(context);
      expect(result.referencePath).toEqual(path.join(dirTmp, '__snapshots__', 'reference', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join(dirTmp, '__snapshots__', 'latest', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join(dirTmp, '__snapshots__', 'diff', 'screenshotDir', 'screenshotName.png'));
      expect(getScreenshotDirSpy).toHaveBeenCalledWith(context);
      expect(getScreenshotNameSpy).toHaveBeenCalledWith(context);
    });

    it('creates reference, latest, and diff paths for tests pulled from node_modules', () => {
      const baseCompare = new BaseCompare({
        baseScreenshotDir: process.cwd(),
        locale: 'en',
        theme: 'cerner-default-theme',
      });

      jest.spyOn(baseCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      jest.spyOn(baseCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const updatedContext = {
        ...context,
        test: {
          ...context.test,
          file: path.join(process.cwd(), 'node_modules', 'test', 'wdio', 'test-spec.js'),
        },
      };
      const result = baseCompare.getScreenshotPaths(updatedContext);
      expect(result.referencePath).toEqual(path.join(process.cwd(), 'test', 'wdio', '__snapshots__', 'reference', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join(process.cwd(), 'test', 'wdio', '__snapshots__', 'latest', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join(process.cwd(), 'test', 'wdio', '__snapshots__', 'diff', 'screenshotDir', 'screenshotName.png'));
    });

    it('creates reference, latest, and diff paths with custom baseScreenshotDir', () => {
      const baseCompare = new BaseCompare({
        baseScreenshotDir: 'customBaseScreenshotDir',
        locale: 'en',
        theme: 'cerner-default-theme',
      });
      jest.spyOn(baseCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      jest.spyOn(baseCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const result = baseCompare.getScreenshotPaths(context);
      const tempDirPath = path.join('packages', 'terra-functional-testing', 'tests', 'tmp');

      expect(result.referencePath).toEqual(path.join('customBaseScreenshotDir', tempDirPath, '__snapshots__', 'reference', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join('customBaseScreenshotDir', tempDirPath, '__snapshots__', 'latest', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join('customBaseScreenshotDir', tempDirPath, '__snapshots__', 'diff', 'screenshotDir', 'screenshotName.png'));
    });
  });

  describe('BaseCompare.processScreenshot', () => {
    it('creates the latest screenshot', async () => {
      const baseCompare = new BaseCompare({});

      expect(baseCompare.processScreenshot).toBeDefined();
      expect(baseCompare.processScreenshot('', '')).resolves.toBe(undefined);
    });
  });
});
