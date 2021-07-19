import path from 'path';

import BaseCompare from '../../../../../src/services/wdio-visual-regression-service/methods/BaseCompare';

const dirTmp = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');

const context = {
  desiredCapabilities: {
    browserName: 'chrome',
  },
  test: {
    file: path.join(dirTmp, 'test-spec.js'),
  },
  meta: {
    currentFormFactor: 'large',
  },
  options: {
    name: 'displays a button',
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

  it('should call constructor with no options', () => {
    const baseCompare = new BaseCompare({});

    expect(baseCompare.baseScreenshotDir).toBe(process.cwd());
    expect(baseCompare.cloudRegion).toBe('');
    expect(baseCompare.locale).toBe('en');
    expect(baseCompare.theme).toBe('terra-default-theme');
    expect(baseCompare.updateScreenshots).toBe(false);
  });

  it('should call constructor with options', () => {
    const baseCompare = new BaseCompare({
      cloudRegion: 'dev',
      locale: 'fr',
      theme: 'terra-lowlight-theme',
      updateScreenshots: true,
    });

    expect(baseCompare.baseScreenshotDir).toBe(process.cwd());
    expect(baseCompare.cloudRegion).toBe('dev');
    expect(baseCompare.locale).toBe('fr');
    expect(baseCompare.theme).toBe('terra-lowlight-theme');
    expect(baseCompare.updateScreenshots).toBe(true);
  });

  describe('BaseCompare.getScreenshotName', () => {
    it('used test name as screenshot name', () => {
      const baseCompare = new BaseCompare({});
      const createTestNameSpy = jest.spyOn(baseCompare, 'createTestName');

      const result = baseCompare.getScreenshotName(context);
      expect(result).toEqual('displays_a_button.png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, context.options.name);
    });

    it('uses custom name screenshot name', () => {
      const baseCompare = new BaseCompare({});
      const createTestNameSpy = jest.spyOn(baseCompare, 'createTestName');
      const result = baseCompare.getScreenshotName({ ...context, options: { name: 'custom' } });
      expect(result).toEqual('custom.png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, 'custom');
    });
  });

  describe('BaseCompare.getScreenshotDir', () => {
    it('returns a screenshot dir with the theme, locale, formfactor, and spec name.', () => {
      const baseCompare = new BaseCompare({});
      const result = baseCompare.getScreenshotDir(context);
      expect(result).toEqual(path.join('terra-default-theme', 'en', 'chrome_large', 'test-spec'));
    });

    it('returns a screenshot dir with the cloudRegion, theme, locale, formfactor, and spec name.', () => {
      const options = { cloudRegion: 'dev' };
      const baseCompare = new BaseCompare(options);
      const result = baseCompare.getScreenshotDir(context);
      expect(result).toEqual(path.join('dev', 'terra-default-theme', 'en', 'chrome_large', 'test-spec'));
    });
  });

  describe('BaseCompare.getScreenshotPaths', () => {
    it('creates reference, latest, and diff paths with default values', () => {
      const baseCompare = new BaseCompare({
        locale: 'en',
        theme: 'cerner-default-theme',
        updateScreenshots: true,
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
        locale: 'en',
        theme: 'cerner-default-theme',
      });

      jest.spyOn(baseCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      jest.spyOn(baseCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const updatedContext = {
        ...context,
        test: {
          ...context.test,
          file: path.join(process.cwd(), 'node_modules', 'packageName', 'test', 'wdio', 'test-spec.js'),
        },
      };
      const result = baseCompare.getScreenshotPaths(updatedContext);
      expect(result.referencePath).toEqual(path.join(process.cwd(), 'tests', 'wdio', 'packageName', 'test', 'wdio', '__snapshots__', 'reference', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join(process.cwd(), 'tests', 'wdio', 'packageName', 'test', 'wdio', '__snapshots__', 'latest', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join(process.cwd(), 'tests', 'wdio', 'packageName', 'test', 'wdio', '__snapshots__', 'diff', 'screenshotDir', 'screenshotName.png'));
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
        const results = baseCompare.createResultReport(true, 0, true, true, false);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 0,
          isWithinMismatchTolerance: true,
          isSameDimensions: true,
          screenshotWasUpdated: false,
        }));
      });

      it('returns expected results when misMatchPercentage is 0 and isSameDimensions is false', () => {
        const results = baseCompare.createResultReport(true, 0, true, false, false);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 0,
          isWithinMismatchTolerance: true,
          isSameDimensions: false,
          screenshotWasUpdated: false,
        }));
      });

      it('returns expected results when misMatchPercentage is greater than 0', () => {
        const results = baseCompare.createResultReport(true, 30, true, false, false);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 30,
          isWithinMismatchTolerance: true,
          isSameDimensions: false,
          screenshotWasUpdated: false,
        }));
      });

      it('returns expected results when screenshotWasUpdated is true', () => {
        const results = baseCompare.createResultReport(true, 30, true, false, true);
        expect(results).toEqual(expect.objectContaining({
          misMatchPercentage: 30,
          isWithinMismatchTolerance: true,
          isSameDimensions: false,
          screenshotWasUpdated: true,
        }));
      });
    });
  });
});
