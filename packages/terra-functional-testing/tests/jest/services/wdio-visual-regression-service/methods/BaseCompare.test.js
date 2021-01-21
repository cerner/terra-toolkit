import path from 'path';

import BaseCompare from '../../../../../src/services/wdio-visual-regression-service/methods/BaseCompare';

const dirTmp = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');

const context = {
  desiredCapabilities: {
    browserName: 'chrome',
  },
  test: {
    file: path.join(dirTmp, 'test-spec.js'),
    title: 'displays a button',
  },
  meta: {
    currentFormFactor: 'large',
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
    it('used test name as screenshot name', () => {
      const baseCompare = new BaseCompare({});
      const createTestNameSpy = jest.spyOn(baseCompare, 'createTestName');

      const result = baseCompare.getScreenshotName(context);
      expect(result).toEqual('displays_a_button.png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, context.test.title);
    });

    it('uses custom name screenshot name', () => {
      const baseCompare = new BaseCompare({});
      const createTestNameSpy = jest.spyOn(baseCompare, 'createTestName');
      const result = baseCompare.getScreenshotName({ ...context, options: { name: 'custom' } });
      expect(result).toEqual('custom.png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, 'custom');
    });
  });

  it('BaseCompare.getScreenshotDir', () => {
    const baseCompare = new BaseCompare({});

    const result = baseCompare.getScreenshotDir(context);
    expect(result).toEqual(path.join('terra-default-theme', 'en', 'chrome_large', 'test-spec'));
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

  describe('BaseCompare.createResultReport', () => {
    const baseCompare = new BaseCompare({});

    it('when referenceExists is false', () => {
      const results = baseCompare.createResultReport(false);
      expect(results).toEqual(expect.objectContaining({
        isNewScreenshot: true,
      }));
    });

    describe('when referenceExists is true', () => {
      it('returns expected results when misMatchPercentage is 0 and isSameDimensions is true', () => {
        const results = baseCompare.createResultReport(true, 0, true, true);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 0,
          isWithinMisMatchTolerance: true,
          isSameDimensions: true,
          isExactSameImage: true,
        }));
      });

      it('returns expected results when misMatchPercentage is 0 and isSameDimensions is false', () => {
        const results = baseCompare.createResultReport(true, 0, true, false);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 0,
          isWithinMisMatchTolerance: true,
          isSameDimensions: false,
          isExactSameImage: false,
        }));
      });

      it('returns expected results when misMatchPercentage is greater than 0', () => {
        const results = baseCompare.createResultReport(true, 30, true, false);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 30,
          isWithinMisMatchTolerance: true,
          isSameDimensions: false,
          isExactSameImage: false,
        }));
      });
    });
  });
});
