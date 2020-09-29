import path from 'path';
import fs from 'fs-extra';
import resemble from 'node-resemble-js';

import BaseCompare from '../../../../../src/services/wdio-visual-regression-service/methods/BaseCompare';
import LocalCompare from '../../../../../src/services/wdio-visual-regression-service/methods/LocalCompare';

const dirTmp = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');
const dirFixture = path.resolve(__dirname, '..', '..', '..', '..', 'fixtures');

async function readAsBase64(file) {
  // read binary data
  const content = await fs.readFile(file);
  // convert binary data to base64 encoded string
  return new Buffer(content).toString('base64'); // eslint-disable-line no-buffer-constructor
}

async function compareImages(image1, image2, misMatchPercentage = 0) {
  return new Promise(resolve => {
    const image = resemble(image1).compareTo(image2);
    image.onComplete(data => {
      expect(data.isSameDimensions).toBeTruthy();
      expect(Number(data.misMatchPercentage)).toBeCloseTo(0, misMatchPercentage)
      resolve();
    });
  });
}

const context = {
  test: {
    file: path.join(dirTmp, 'test-spec.js'),
    parent: 'Test Component',
    title: 'displays a button',
  },
  desiredCapabilities: {
    browserName: 'chrome',
  },
  meta: {
    viewport: { height: 600, width: 1000 },
  },
};

describe('LocalCompare', () => {
  beforeAll(async () => {
    await fs.remove(dirTmp);
  });

  afterEach(async () => {
    await fs.remove(dirTmp);
  });

  it('creates a instance of BaseCompare', () => {
    const localCompare = new LocalCompare();
    expect(localCompare).toBeInstanceOf(BaseCompare);
  });

  it('LocalCompare.createTestName', () => {
    const localCompare = new LocalCompare();
    let result = localCompare.createTestName('hello');
    expect(result).toEqual('hello');

    result = localCompare.createTestName('hello[world]');
    expect(result).toEqual('world');

    result = localCompare.createTestName('hello world ');
    expect(result).toEqual('hello_world');

    result = localCompare.createTestName('hello:world?default+08.name yes');
    expect(result).toEqual('hello-world-default_08_name_yes');
  });

  describe('LocalCompare.getScreenshotName', () => {
    it('used parent + test name as screenshot name', () => {
      const localCompare = new LocalCompare();
      const createTestNameSpy = jest.spyOn(localCompare, 'createTestName');

      const result = localCompare.getScreenshotName(context);
      expect(result).toEqual('Test_Component[displays_a_button].png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, context.test.parent);
      expect(createTestNameSpy).toHaveBeenNthCalledWith(2, context.test.title);
    });

    it('uses parent + custom name screenshot name', () => {
      const localCompare = new LocalCompare();
      const createTestNameSpy = jest.spyOn(localCompare, 'createTestName');
      const result = localCompare.getScreenshotName({ ...context, options: { name: 'custom' }});
      expect(result).toEqual('Test_Component[custom].png');
      expect(createTestNameSpy).toHaveBeenNthCalledWith(1, context.test.parent);
      expect(createTestNameSpy).toHaveBeenNthCalledWith(2, 'custom');
    });
  });

  describe('LocalCompare.getScreenshotName', () => {
    it('returns formFactor is defined in constructor', () => {
      const localCompare = new LocalCompare({ formFactor: 'tiny' });
      const result = localCompare.getFormFactor(300);
      expect(result).toEqual('tiny');
    });

    it('determines formFactor from viewport width', () => {
      const localCompare = new LocalCompare();
      let result = localCompare.getFormFactor(400);
      expect(result).toEqual('tiny');

      result = localCompare.getFormFactor(500);
      expect(result).toEqual('small');

      result = localCompare.getFormFactor(700);
      expect(result).toEqual('medium');

      result = localCompare.getFormFactor(900);
      expect(result).toEqual('large');

      result = localCompare.getFormFactor(1200);
      expect(result).toEqual('huge');

      result = localCompare.getFormFactor(1500);
      expect(result).toEqual('enormous');

      // TO DO: should we fail if it's larger or not an exact terra-viewport?
      result = localCompare.getFormFactor(30000);
      expect(result).toEqual('enormous');
    });
  });

  it('LocalCompare.getScreenshotDir', () => {
    const localCompare = new LocalCompare();
    const getFormFactorSpy = jest.spyOn(localCompare, 'getFormFactor');

    const result = localCompare.getScreenshotDir(context);
    expect(result).toEqual(path.join('chrome_large', 'test-spec'));
    expect(getFormFactorSpy).toHaveBeenCalledWith(1000);
  });

  describe('LocalCompare.getScreenshotPaths', () => {
    it('creates reference, latest, and diff paths with default values', () => {
      const localCompare = new LocalCompare({
        baseScreenshotDir: process.cwd(),
        ignoreComparison: 'nothing',
        locale: 'en',
        misMatchTolerance: 0.01,
        theme: 'cerner-default-theme',
      });

      const getScreenshotDirSpy = jest.spyOn(localCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      const getScreenshotNameSpy = jest.spyOn(localCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const result = localCompare.getScreenshotPaths(context);
      expect(result.referencePath).toEqual(path.join(dirTmp, '__snapshots__', 'reference', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join(dirTmp, '__snapshots__', 'latest', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join(dirTmp, '__snapshots__', 'diff', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(getScreenshotDirSpy).toHaveBeenCalledWith(context);
      expect(getScreenshotNameSpy).toHaveBeenCalledWith(context);
    });

    it('creates reference, latest, and diff paths for tests pulled from node_modules', () => {
      const localCompare = new LocalCompare({
        baseScreenshotDir: process.cwd(),
        ignoreComparison: 'nothing',
        locale: 'en',
        misMatchTolerance: 0.01,
        theme: 'cerner-default-theme',
      });

      jest.spyOn(localCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      jest.spyOn(localCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const updatedContext = {
        ...context,
        test: {
          ...context.test,
          file: path.join(process.cwd(), 'node_modules', 'test', 'wdio', 'test-spec.js'),
        },
      };
      const result = localCompare.getScreenshotPaths(updatedContext);
      expect(result.referencePath).toEqual(path.join(process.cwd(), 'test', 'wdio', '__snapshots__', 'reference', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join(process.cwd(), 'test', 'wdio', '__snapshots__', 'latest', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join(process.cwd(), 'test', 'wdio', '__snapshots__', 'diff', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
    });

    it('creates reference, latest, and diff paths with custom baseScreenshotDir', () => {
      const localCompare = new LocalCompare({
        baseScreenshotDir: 'customBaseScreenshotDir',
        ignoreComparison: 'nothing',
        locale: 'en',
        misMatchTolerance: 0.01,
        theme: 'cerner-default-theme',
      });
      jest.spyOn(localCompare, 'getScreenshotDir').mockReturnValue('screenshotDir');
      jest.spyOn(localCompare, 'getScreenshotName').mockReturnValue('screenshotName.png');

      const result = localCompare.getScreenshotPaths(context);
      const tempDirPath = path.join('packages', 'terra-functional-testing', 'tests', 'tmp');

      expect(result.referencePath).toEqual(path.join('customBaseScreenshotDir', tempDirPath, '__snapshots__', 'reference', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(result.latestPath).toEqual(path.join('customBaseScreenshotDir', tempDirPath, '__snapshots__', 'latest', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
      expect(result.diffPath).toEqual(path.join('customBaseScreenshotDir', tempDirPath, '__snapshots__', 'diff', 'cerner-default-theme', 'en', 'screenshotDir', 'screenshotName.png'));
    });
  });

  describe('LocalCompare.processScreenshot', () => {
    let localCompare;

    beforeEach(() => {
      localCompare = new LocalCompare({
        baseScreenshotDir: process.cwd(),
        ignoreComparison: 'nothing',
        locale: 'en',
        misMatchTolerance: 0.01,
        theme: 'cerner-default-theme',
      });

      jest.restoreAllMocks();
    });

    it('creates the latest screenshot', async () => {
      const base64Screenshot = await readAsBase64(path.join(dirFixture, 'image', '100x100.png'));

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = await fs.exists(screenshotPaths.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = await fs.exists(screenshotPaths.latestPath);
      expect(latestExists).toBeTruthy();
    });

    it('creates a reference file for the first run', async () => {
      const base64Screenshot = await readAsBase64(path.join(dirFixture, 'image', '100x100.png'));

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      const results = await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(results).toMatchObject({
        misMatchPercentage: 0,
        isWithinMisMatchTolerance: true,
        isSameDimensions: true,
        isExactSameImage: true,
      });

      const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = await fs.exists(screenshotPaths.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = await fs.exists(screenshotPaths.latestPath);
      expect(latestExists).toBeTruthy();
    });

    it('does not update the reference image when changes are in tolerance', async () => {
      const base64Screenshot = await readAsBase64(path.join(dirFixture, 'image', '100x100.png'));

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      const resultFirst = await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(resultFirst).toMatchObject({
        misMatchPercentage: 0,
        isWithinMisMatchTolerance: true,
        isSameDimensions: true,
        isExactSameImage: true,
      });

      const screenshotPathsFirst = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = await fs.exists(screenshotPathsFirst.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = await fs.exists(screenshotPathsFirst.latestPath);
      expect(latestExists).toBeTruthy();

      // check last modified
      const referenceStatsFirst = await fs.stat(screenshotPathsFirst.referencePath);
      expect(referenceStatsFirst.mtime.getTime()).toBeGreaterThan(0);

      const latestStatsFirst = await fs.stat(screenshotPathsFirst.latestPath);
      expect(latestStatsFirst.mtime.getTime()).toBeGreaterThan(0);

      // 2nd run --> go against reference image
      const resultSecond = await localCompare.processScreenshot(context, base64Screenshot);

      // check reference getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(2);
      expect(getScreenshotPathsSpy).toHaveBeenNthCalledWith(2, context);

      // check if image is reported as same
      expect(resultSecond).toMatchObject({
        misMatchPercentage: 0,
        isWithinMisMatchTolerance: true,
        isSameDimensions: true,
        isExactSameImage: true,
      });

      const screenshotPathsSecond = getScreenshotPathsSpy.mock.results[1].value;

      // check that reference was not updated
      const referenceStatsSecond = await fs.stat(screenshotPathsSecond.referencePath);
      expect(referenceStatsSecond.mtime.getTime()).toEqual(referenceStatsFirst.mtime.getTime());

      // check that latest was updated
      const latestStatsSecond = await fs.stat(screenshotPathsSecond.latestPath);
      expect(latestStatsSecond.mtime.getTime()).not.toEqual(latestStatsFirst.mtime.getTime());
    });

    it('creates a diff image when changes are not in tolerance', async () => {
      const base64ScreenshotReference = await readAsBase64(path.join(dirFixture, 'image', '100x100.png'));
      const base64ScreenshotNew = await readAsBase64(path.join(dirFixture, 'image', '100x100-rotated.png'));

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      const resultFirst = await localCompare.processScreenshot(context, base64ScreenshotReference);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(resultFirst).toMatchObject({
        misMatchPercentage: 0,
        isWithinMisMatchTolerance: true,
        isSameDimensions: true,
        isExactSameImage: true,
      });

      const screenshotPathsFirst = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = await fs.exists(screenshotPathsFirst.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = await fs.exists(screenshotPathsFirst.latestPath);
      expect(latestExists).toBeTruthy();

      // check last modified
      const referenceStatsFirst = await fs.stat(screenshotPathsFirst.referencePath);
      expect(referenceStatsFirst.mtime.getTime()).toBeGreaterThan(0);

      // 2nd run --> create diff image
      const resultSecond = await localCompare.processScreenshot(context, base64ScreenshotNew);

      // check diff results
      expect(resultSecond.misMatchPercentage).toBeGreaterThan(resultFirst.misMatchPercentage);
      expect(resultSecond.isExactSameImage).toBeFalsy();
      expect(resultSecond.isWithinMisMatchTolerance).toBeFalsy();
      expect(resultSecond.isSameDimensions).toBeTruthy();

      const screenshotPathsSecond = getScreenshotPathsSpy.mock.results[1].value;

      // check if reference is still the same
      const referenceStatsSecond = await fs.stat(screenshotPathsSecond.referencePath);
      expect(referenceStatsSecond.mtime.getTime()).toEqual(referenceStatsFirst.mtime.getTime());

      // check if diff image was created
      const diffExists = await fs.exists(screenshotPathsSecond.diffPath);
      expect(diffExists).toBeTruthy();

      // check if diff is correct
      await compareImages(screenshotPathsSecond.diffPath, path.join(dirFixture, 'image', '100x100-diff.png'));
    });

    it('deletes existing diff image when image is in tolerance now', async () => {
      const base64ScreenshotReference = await readAsBase64(path.join(dirFixture, 'image', '100x100.png'));
      const base64ScreenshotNew = await readAsBase64(path.join(dirFixture, 'image', '100x100-rotated.png'));

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      await localCompare.processScreenshot(context, base64ScreenshotReference);

      // 2nd run --> create diff image
      await localCompare.processScreenshot(context, base64ScreenshotNew);

      const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

      // check if diff image was created
      const diffExistsFirst = await fs.exists(screenshotPaths.diffPath);
      expect(diffExistsFirst).toBeTruthy();

      // 3rd run --> delete existing diff
      const updateContext = {
        ...context,
        options: {
          misMatchTolerance: 100,
        },
      };
      await localCompare.processScreenshot(updateContext, base64ScreenshotNew);

      // check if diff image was deleted
      const diffExistsSecond = await fs.exists(screenshotPaths.diffPath);
      expect(diffExistsSecond).toBeFalsy();
    });
  });

  describe('LocalCompare.processScreenshot-misMatchTolerance', () => {
    let screenshotBase;
    let screenshotToleranceDefaultWithin;
    let screenshotToleranceDefaultOutside;
    let screenshotToleranceCustomWithin;
    let screenshotToleranceCustomOutside;

    beforeAll(async () => {
      screenshotBase = await readAsBase64(path.join(dirFixture, 'misMatchTolerance', 'base.png'));
      screenshotToleranceDefaultWithin = await readAsBase64(path.join(dirFixture, 'misMatchTolerance', 'default-within.png'),);
      screenshotToleranceDefaultOutside = await readAsBase64(path.join(dirFixture, 'misMatchTolerance', 'default-outside.png'));
      screenshotToleranceCustomWithin = await readAsBase64(path.join(dirFixture, 'misMatchTolerance', 'custom-within.png'));
      screenshotToleranceCustomOutside = await readAsBase64(path.join(dirFixture, 'misMatchTolerance', 'custom-outside.png'));
    });

    describe('uses default misMatchTolerance', () => {
      let localCompare;
      let getScreenshotPathsSpy;
      beforeEach(async () => {
        jest.restoreAllMocks();
        localCompare = new LocalCompare({
          baseScreenshotDir: process.cwd(),
          ignoreComparison: 'ignore',
          locale: 'en',
          misMatchTolerance: 0.01,
          theme: 'cerner-default-theme',
        });

        getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotBase);
      });

      it('reports equal when in tolerance', async () => {
        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotToleranceDefaultWithin);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThanOrEqual(0.01);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeTruthy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was not created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });

      it('reports diff when NOT in tolerance', async () => {
        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotToleranceDefaultOutside);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0.01);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeFalsy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });

    describe('uses custom misMatchTolerance passed in constructor option', () => {
      let localCompare;
      let getScreenshotPathsSpy;

      beforeEach(async () => {
        jest.restoreAllMocks();
        localCompare = new LocalCompare({
          baseScreenshotDir: process.cwd(),
          ignoreComparison: 'ignore',
          locale: 'en',
          misMatchTolerance: 0.25,
          theme: 'cerner-default-theme',
        });

        getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotBase);
      });

      it('reports equal when in tolerance', async () => {
        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotToleranceCustomWithin);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThanOrEqual(0.25);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeTruthy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was not created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });

      it('reports diff when NOT in tolerance', async () => {
        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotToleranceCustomOutside);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0.25);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeFalsy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });

    describe('uses custom misMatchTolerance passed in command options', () => {
      let localCompare;
      let getScreenshotPathsSpy;

      beforeEach(async () => {
        jest.restoreAllMocks();
        localCompare = new LocalCompare({
          baseScreenshotDir: process.cwd(),
          ignoreComparison: 'ignore',
          locale: 'en',
          misMatchTolerance: 0.10,
          theme: 'cerner-default-theme',
        });

        getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotBase);
      });

      it('reports equal when in tolerance', async () => {
        // compare screenshots
        const updateContext = {
          ...context,
          options: {
            misMatchTolerance: 0.25,
          },
        };
        const result = await localCompare.processScreenshot(updateContext, screenshotToleranceCustomWithin);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThanOrEqual(0.25);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeTruthy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was not created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });

      it('reports diff when NOT in tolerance', async () => {
        // compare screenshots
        const updateContext = {
          ...context,
          options: {
            misMatchTolerance: 0.25,
          },
        };
        const result = await localCompare.processScreenshot(updateContext, screenshotToleranceCustomOutside);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0.25);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeFalsy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });
  });

  describe('LocalCompare.processScreenshot-ignoreComparison', () => {
    let screenshotRed;
    let screenshotRedDiff;
    beforeAll(async () => {
      screenshotRed = await readAsBase64(path.join(dirFixture, 'ignoreComparison', '100x100-red.png'));
      screenshotRedDiff = await readAsBase64(path.join(dirFixture, 'ignoreComparison', '100x100-red2.png'));
    });

    describe('uses default ignoreComparison', () => {
      it('reports diff when colors differs', async () => {
        const localCompare = new LocalCompare({
          baseScreenshotDir: process.cwd(),
          ignoreComparison: 'ignore',
          locale: 'en',
          misMatchTolerance: 0.01,
          theme: 'cerner-default-theme',
        });

        const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotRed);

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if latest image was created
        const referenceExists = await fs.exists(screenshotPaths.latestPath);
        expect(referenceExists).toBeTruthy();

        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotRedDiff);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0);
        expect(result.isExactSameImage).toBeFalsy();
        expect(result.isWithinMisMatchTolerance).toBeFalsy();

        // check if diff image was created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });

    describe('uses custom ignoreComparison passed in constructor option', () => {
      it('reports equal with ignoreComparison=colors when colors differs', async () => {
        const localCompare = new LocalCompare({
          baseScreenshotDir: process.cwd(),
          ignoreComparison: 'colors',
          locale: 'en',
          misMatchTolerance: 0.01,
          theme: 'cerner-default-theme',
        });

        const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotRed);

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if latest image was created
        const referenceExists = await fs.exists(screenshotPaths.latestPath);
        expect(referenceExists).toBeTruthy();

        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotRedDiff);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThanOrEqual(0.01);
        expect(result.isExactSameImage).toBeTruthy();
        expect(result.isWithinMisMatchTolerance).toBeTruthy();

        // check if diff image was not created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });
    });

    describe('uses custom ignoreComparison passed in command options', () => {
      it('reports equal with ignoreComparison=colors when colors differs', async () => {
        const localCompare = new LocalCompare({
          baseScreenshotDir: process.cwd(),
          ignoreComparison: 'ignore',
          locale: 'en',
          misMatchTolerance: 0.01,
          theme: 'cerner-default-theme',
        });
        const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotRed);

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if latest image was created
        const referenceExists = await fs.exists(screenshotPaths.latestPath);
        expect(referenceExists).toBeTruthy();

        // compare screenshots
        const updateContext = {
          ...context,
          options: {
            ignoreComparison: 'colors',
          },
        };
        const result = await localCompare.processScreenshot(updateContext, screenshotRedDiff);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThan(0.01);
        expect(result.isExactSameImage).toBeTruthy();
        expect(result.isWithinMisMatchTolerance).toBeTruthy();

        // check if diff image was not created
        const diffExists = await fs.exists(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });
    });
  });
});
