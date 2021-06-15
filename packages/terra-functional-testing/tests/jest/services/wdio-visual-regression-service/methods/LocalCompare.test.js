import path from 'path';
import fs from 'fs-extra';
import resemble from '@mirzazeyrek/node-resemble-js';

import BaseCompare from '../../../../../src/services/wdio-visual-regression-service/methods/BaseCompare';
import LocalCompare from '../../../../../src/services/wdio-visual-regression-service/methods/LocalCompare';
import eventEmitter from '../../../../../src/commands/utils/eventEmitter';

const dirTmp = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');
const dirFixture = path.resolve(__dirname, '..', '..', '..', '..', 'fixtures');
const TIMEOUT = 10000;

async function compareImages(image1, image2, misMatchPercentage = 0) {
  return new Promise(resolve => {
    const image = resemble(image1).compareTo(image2);
    image.onComplete(data => {
      expect(data.isSameDimensions).toBeTruthy();
      expect(Number(data.misMatchPercentage)).toBeCloseTo(0, misMatchPercentage);
      resolve();
    });
  });
}

const context = {
  desiredCapabilities: {
    browserName: 'chrome',
  },
  test: {
    file: path.join(dirTmp, 'test-spec.js'),
    parent: 'Test Component',
  },
  meta: {
    viewport: { height: 600, width: 1000 },
  },
  options: {
    name: 'displays a button',
  },
};

const pauseTest = () => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, TIMEOUT / 2);
});

describe('LocalCompare', () => {
  let localCompare;

  beforeAll(async () => {
    await fs.remove(dirTmp);
    localCompare = new LocalCompare({});
  });

  afterEach(async () => {
    await fs.remove(dirTmp);
  });

  it('creates a instance of BaseCompare', () => {
    expect(localCompare).toBeInstanceOf(BaseCompare);
  });

  describe('LocalCompare.processScreenshot', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('creates the latest screenshot', async () => {
      const base64Screenshot = fs.readFileSync(path.join(dirFixture, 'image', '100x100.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = fs.existsSync(screenshotPaths.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = fs.existsSync(screenshotPaths.latestPath);
      expect(latestExists).toBeTruthy();

      expect(emitSpy).toHaveBeenCalledWith('terra-functional-testing:capture-screenshot', screenshotPaths.latestPath);
    });

    it('creates a reference file for the first run', async () => {
      const base64Screenshot = fs.readFileSync(path.join(dirFixture, 'image', '100x100.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      const results = await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(results).toMatchObject({
        isNewScreenshot: true,
      });

      const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = fs.existsSync(screenshotPaths.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = fs.existsSync(screenshotPaths.latestPath);
      expect(latestExists).toBeTruthy();
    });

    it('does not update the reference image when changes are in tolerance', async () => {
      const base64Screenshot = fs.readFileSync(path.join(dirFixture, 'image', '100x100.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      const resultFirst = await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(resultFirst).toMatchObject({
        isNewScreenshot: true,
      });

      const screenshotPathsFirst = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = fs.existsSync(screenshotPathsFirst.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = fs.existsSync(screenshotPathsFirst.latestPath);
      expect(latestExists).toBeTruthy();

      // check last modified
      const referenceStatsFirst = fs.statSync(screenshotPathsFirst.referencePath);
      expect(referenceStatsFirst.mtimeMs).toBeGreaterThan(0);

      const latestStatsFirst = fs.statSync(screenshotPathsFirst.latestPath);
      expect(latestStatsFirst.mtimeMs).toBeGreaterThan(0);

      // 2nd run --> go against reference image
      await pauseTest(); // pause to ensure time elapses between screenshot creation
      const resultSecond = await localCompare.processScreenshot(context, base64Screenshot);

      // check reference getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(2);
      expect(getScreenshotPathsSpy).toHaveBeenNthCalledWith(2, context);

      // check if image is reported as same
      expect(resultSecond).toMatchObject({
        misMatchPercentage: 0,
        isWithinMismatchTolerance: true,
        isSameDimensions: true,
        screenshotWasUpdated: false,
      });

      const screenshotPathsSecond = getScreenshotPathsSpy.mock.results[1].value;

      // check that reference was not updated
      const referenceStatsSecond = fs.statSync(screenshotPathsSecond.referencePath);
      expect(referenceStatsSecond.mtimeMs).toEqual(referenceStatsFirst.mtimeMs);

      // check that latest was updated
      const latestStatsSecond = fs.statSync(screenshotPathsSecond.latestPath);
      expect(latestStatsSecond.mtimeMs).not.toEqual(latestStatsFirst.mtimeMs);
    }, TIMEOUT);

    it('creates a diff image when changes are not in tolerance', async () => {
      const base64ScreenshotReference = fs.readFileSync(path.join(dirFixture, 'image', '100x100.png'), { encoding: 'base64' });
      const base64ScreenshotNew = fs.readFileSync(path.join(dirFixture, 'image', '100x100-rotated.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      const resultFirst = await localCompare.processScreenshot(context, base64ScreenshotReference);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(resultFirst).toMatchObject({
        isNewScreenshot: true,
      });

      const screenshotPathsFirst = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = fs.existsSync(screenshotPathsFirst.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = fs.existsSync(screenshotPathsFirst.latestPath);
      expect(latestExists).toBeTruthy();

      // check last modified
      const referenceStatsFirst = fs.statSync(screenshotPathsFirst.referencePath);
      expect(referenceStatsFirst.mtimeMs).toBeGreaterThan(0);

      // 2nd run --> create diff image
      await pauseTest(); // pause to ensure time elapses between screenshot creation
      const resultSecond = await localCompare.processScreenshot(context, base64ScreenshotNew);

      // check diff results
      expect(resultSecond.misMatchPercentage).toBeGreaterThan(0);
      expect(resultSecond.isWithinMismatchTolerance).toBeFalsy();
      expect(resultSecond.isSameDimensions).toBeTruthy();

      const screenshotPathsSecond = getScreenshotPathsSpy.mock.results[1].value;

      // check if reference is still the same
      const referenceStatsSecond = fs.statSync(screenshotPathsSecond.referencePath);
      expect(referenceStatsSecond.mtimeMs).toEqual(referenceStatsFirst.mtimeMs);

      // check if diff image was created
      const diffExists = fs.existsSync(screenshotPathsSecond.diffPath);
      expect(diffExists).toBeTruthy();

      // check if diff is correct
      await compareImages(screenshotPathsSecond.diffPath, path.join(dirFixture, 'image', '100x100-diff.png'));
    }, TIMEOUT);

    it('creates a diff image when latest image has different dimensions', async () => {
      const base64ScreenshotReference = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'base.png'), { encoding: 'base64' });
      const base64ScreenshotNew = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'within-diff-dimensions.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      const resultFirst = await localCompare.processScreenshot(context, base64ScreenshotReference);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(resultFirst).toMatchObject({
        isNewScreenshot: true,
      });

      const screenshotPathsFirst = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = fs.existsSync(screenshotPathsFirst.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = fs.existsSync(screenshotPathsFirst.latestPath);
      expect(latestExists).toBeTruthy();

      // check last modified
      const referenceStatsFirst = fs.statSync(screenshotPathsFirst.referencePath);
      expect(referenceStatsFirst.mtimeMs).toBeGreaterThan(0);

      // 2nd run --> create diff image
      await pauseTest(); // pause to ensure time elapses between screenshot creation
      const resultSecond = await localCompare.processScreenshot(context, base64ScreenshotNew);

      // check diff results
      expect(resultSecond.misMatchPercentage).toBe(0);
      expect(resultSecond.isWithinMismatchTolerance).toBeTruthy();
      expect(resultSecond.isSameDimensions).toBeFalsy();

      const screenshotPathsSecond = getScreenshotPathsSpy.mock.results[1].value;

      // check if reference is still the same
      const referenceStatsSecond = fs.statSync(screenshotPathsSecond.referencePath);
      expect(referenceStatsSecond.mtimeMs).toEqual(referenceStatsFirst.mtimeMs);

      // check if diff image was created
      const diffExists = fs.existsSync(screenshotPathsSecond.diffPath);
      expect(diffExists).toBeTruthy();
    }, TIMEOUT);

    it('deletes existing diff image when image is in tolerance now', async () => {
      const base64ScreenshotReference = fs.readFileSync(path.join(dirFixture, 'image', '100x100.png'), { encoding: 'base64' });
      const base64ScreenshotNew = fs.readFileSync(path.join(dirFixture, 'image', '100x100-rotated.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      await localCompare.processScreenshot(context, base64ScreenshotReference);

      // 2nd run --> create diff image
      await pauseTest(); // pause to ensure time elapses between screenshot creation
      await localCompare.processScreenshot(context, base64ScreenshotNew);

      const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

      // check if diff image was created
      const diffExistsFirst = fs.existsSync(screenshotPaths.diffPath);
      expect(diffExistsFirst).toBeTruthy();

      // 3rd run --> delete existing diff
      const updateContext = {
        ...context,
        options: {
          mismatchTolerance: 100,
          name: 'displays a button',
        },
      };
      await pauseTest(); // pause to ensure time elapses between screenshot creation
      await localCompare.processScreenshot(updateContext, base64ScreenshotNew);

      // check if diff image was deleted
      const diffExistsSecond = fs.existsSync(screenshotPaths.diffPath);
      expect(diffExistsSecond).toBeFalsy();
    }, TIMEOUT * 3);

    it('auto update the reference image when there is a mismatch', async () => {
      const base64Screenshot = fs.readFileSync(path.join(dirFixture, 'image', '100x100-diff.png'), { encoding: 'base64' });
      const base64ScreenshotNew = fs.readFileSync(path.join(dirFixture, 'image', '100x100.png'), { encoding: 'base64' });

      const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

      // 1st run -> create reference
      const resultFirst = await localCompare.processScreenshot(context, base64Screenshot);

      // check screenshot getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(1);
      expect(getScreenshotPathsSpy).toHaveBeenCalledWith(context);

      // check image results
      expect(resultFirst).toMatchObject({
        isNewScreenshot: true,
      });

      const screenshotPathsFirst = getScreenshotPathsSpy.mock.results[0].value;

      // check if reference image was created
      const referenceExists = fs.existsSync(screenshotPathsFirst.referencePath);
      expect(referenceExists).toBeTruthy();

      // check if latest image was created
      const latestExists = fs.existsSync(screenshotPathsFirst.latestPath);
      expect(latestExists).toBeTruthy();

      // check last modified
      const referenceStatsFirst = fs.statSync(screenshotPathsFirst.referencePath);
      expect(referenceStatsFirst.mtimeMs).toBeGreaterThan(0);

      const latestStatsFirst = fs.statSync(screenshotPathsFirst.latestPath);
      expect(latestStatsFirst.mtimeMs).toBeGreaterThan(0);

      // 2nd run --> go against reference image
      await pauseTest(); // pause to ensure time elapses between screenshot creation
      localCompare.updateScreenshots = true;
      const resultSecond = await localCompare.processScreenshot(context, base64ScreenshotNew);

      // check reference getter
      expect(getScreenshotPathsSpy).toHaveBeenCalledTimes(2);
      expect(getScreenshotPathsSpy).toHaveBeenNthCalledWith(2, context);

      // check if image is reported as different
      expect(resultSecond.misMatchPercentage).toBeGreaterThan(0.01);
      expect(resultSecond.isWithinMismatchTolerance).toBeFalsy();
      expect(resultSecond.isSameDimensions).toBeTruthy();
      expect(resultSecond.screenshotWasUpdated).toBeTruthy();

      const screenshotPathsSecond = getScreenshotPathsSpy.mock.results[1].value;

      // check that reference was updated
      const referenceStatsSecond = fs.statSync(screenshotPathsSecond.referencePath);
      expect(referenceStatsSecond.mtimeMs).toBeGreaterThan(referenceStatsFirst.mtimeMs);

      // check that latest was updated
      const latestStatsSecond = fs.statSync(screenshotPathsSecond.latestPath);
      expect(latestStatsSecond.mtimeMs).toBeGreaterThan(latestStatsFirst.mtimeMs);
    }, TIMEOUT);
  });

  describe('LocalCompare.processScreenshot-mismatchTolerance', () => {
    let screenshotBase;
    let screenshotToleranceDefaultWithin;
    let screenshotToleranceDefaultOutside;
    let screenshotToleranceCustomWithin;
    let screenshotToleranceCustomOutside;

    beforeAll(() => {
      screenshotBase = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'base.png'), { encoding: 'base64' });
      screenshotToleranceDefaultWithin = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'default-within.png'), { encoding: 'base64' });
      screenshotToleranceDefaultOutside = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'default-outside.png'), { encoding: 'base64' });
      screenshotToleranceCustomWithin = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'custom-within.png'), { encoding: 'base64' });
      screenshotToleranceCustomOutside = fs.readFileSync(path.join(dirFixture, 'mismatchTolerance', 'custom-outside.png'), { encoding: 'base64' });
    });

    describe('uses default mismatchTolerance', () => {
      let getScreenshotPathsSpy;
      beforeEach(async () => {
        jest.restoreAllMocks();
        localCompare = new LocalCompare({});

        getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotBase);
        await pauseTest(); // pause to ensure time elapses between screenshot creation
      }, TIMEOUT);

      it('reports equal when in tolerance', async () => {
        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotToleranceDefaultWithin);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThanOrEqual(0.01);
        expect(result.isWithinMismatchTolerance).toBeTruthy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was not created
        const diffExists = fs.existsSync(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });

      it('reports diff when NOT in tolerance', async () => {
        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotToleranceDefaultOutside);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0.01);
        expect(result.isWithinMismatchTolerance).toBeFalsy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was created
        const diffExists = fs.existsSync(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });

    describe('uses custom mismatchTolerance passed in command options', () => {
      let getScreenshotPathsSpy;

      beforeEach(async () => {
        jest.restoreAllMocks();

        getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotBase);
      });

      it('reports equal when in tolerance', async () => {
        // compare screenshots
        const updateContext = {
          ...context,
          options: {
            mismatchTolerance: 0.25,
            name: 'displays a button',
          },
        };
        const result = await localCompare.processScreenshot(updateContext, screenshotToleranceCustomWithin);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThanOrEqual(0.25);
        expect(result.isWithinMismatchTolerance).toBeTruthy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was not created
        const diffExists = fs.existsSync(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });

      it('reports diff when NOT in tolerance', async () => {
        // compare screenshots
        const updateContext = {
          ...context,
          options: {
            mismatchTolerance: 0.25,
            name: 'displays a button',
          },
        };
        const result = await localCompare.processScreenshot(updateContext, screenshotToleranceCustomOutside);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0.25);
        expect(result.isWithinMismatchTolerance).toBeFalsy();

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if diff image was created
        const diffExists = fs.existsSync(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });
  });

  describe('LocalCompare.processScreenshot-ignoreComparison', () => {
    let screenshotRed;
    let screenshotRedDiff;
    beforeAll(() => {
      screenshotRed = fs.readFileSync(path.join(dirFixture, 'ignoreComparison', '100x100-red.png'), { encoding: 'base64' });
      screenshotRedDiff = fs.readFileSync(path.join(dirFixture, 'ignoreComparison', '100x100-red2.png'), { encoding: 'base64' });
    });

    describe('uses default ignoreComparison', () => {
      it('reports diff when colors differs', async () => {
        const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotRed);

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if latest image was created
        const referenceExists = fs.existsSync(screenshotPaths.latestPath);
        expect(referenceExists).toBeTruthy();

        // compare screenshots
        const result = await localCompare.processScreenshot(context, screenshotRedDiff);

        // check diff results
        expect(result.misMatchPercentage).toBeGreaterThan(0);
        expect(result.isWithinMismatchTolerance).toBeFalsy();

        // check if diff image was created
        const diffExists = fs.existsSync(screenshotPaths.diffPath);
        expect(diffExists).toBeTruthy();
      });
    });

    describe('uses custom ignoreComparison passed in command options', () => {
      it('reports equal with ignoreComparison=colors when colors differs', async () => {
        const getScreenshotPathsSpy = jest.spyOn(localCompare, 'getScreenshotPaths');

        // 1st run -> create reference
        await localCompare.processScreenshot(context, screenshotRed);

        const screenshotPaths = getScreenshotPathsSpy.mock.results[0].value;

        // check if latest image was created
        const referenceExists = fs.existsSync(screenshotPaths.latestPath);
        expect(referenceExists).toBeTruthy();

        // compare screenshots
        const updateContext = {
          ...context,
          options: {
            ignoreComparison: 'colors',
            name: 'displays a button',
          },
        };
        const result = await localCompare.processScreenshot(updateContext, screenshotRedDiff);

        // check diff results
        expect(result.misMatchPercentage).toBeLessThan(0.01);
        expect(result.isWithinMismatchTolerance).toBeTruthy();

        // check if diff image was not created
        const diffExists = fs.existsSync(screenshotPaths.diffPath);
        expect(diffExists).toBeFalsy();
      });
    });
  });
});
