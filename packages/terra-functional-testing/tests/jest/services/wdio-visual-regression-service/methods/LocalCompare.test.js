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

describe('LocalCompare', () => {
  beforeAll(async () => {
    await fs.remove(dirTmp);
  });

  afterEach(async () => {
    await fs.remove(dirTmp);
  });

  it('creates a instance of BaseCompare', async () => {
    const localCompare = new LocalCompare();
    expect(localCompare).toBeInstanceOf(BaseCompare);
  });

  describe('processScreenshot', () => {
    let localCompare;

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

  // context('misMatchTolerance', function() {
  //   before(async function() {
  //     this.screenshotBase = await readAsBase64(path.join(dirFixture, 'misMatchTolerance', 'base.png'));

  //     this.screenshotToleranceDefaultWithin = await readAsBase64(
  //       path.join(dirFixture, 'misMatchTolerance', 'default-within.png'),
  //     );
  //     this.screenshotToleranceDefaultOutside = await readAsBase64(
  //       path.join(dirFixture, 'misMatchTolerance', 'default-outside.png'),
  //     );

  //     this.screenshotToleranceCustomWithin = await readAsBase64(
  //       path.join(dirFixture, 'misMatchTolerance', 'custom-within.png'),
  //     );
  //     this.screenshotToleranceCustomOutside = await readAsBase64(
  //       path.join(dirFixture, 'misMatchTolerance', 'custom-outside.png'),
  //     );
  //   });

  //   beforeEach(async function() {
  //     this.screenshotFile = path.join(dirTmp, 'screenshot.png');
  //     this.referencFile = path.join(dirTmp, 'reference.png');
  //     this.diffFile = path.join(dirTmp, 'diff.png');

  //     this.getScreenshotFile = stub().returns(this.screenshotFile);
  //     this.getReferenceFile = stub().returns(this.referencFile);
  //     this.getDiffFile = stub().returns(this.diffFile);
  //   });

  //   context('uses default misMatchTolerance', function() {
  //     beforeEach(async function() {
  //       this.misMatchTolerance = 0.01;
  //       this.context = {};

  //       localCompare = new LocalCompare({
  //         screenshotName: this.getScreenshotFile,
  //         referenceName: this.getReferenceFile,
  //         diffName: this.getDiffFile,
  //       });

  //       // 1st run -> create reference
  //       await localCompare.processScreenshot({}, this.screenshotBase);

  //       // check if reference was created
  //       const existsReference = await fs.exists(this.screenshotFile);
  //       assert.isTrue(existsReference, 'Captured screenshot should exist');
  //     });

  //     it('reports equal when in tolerance', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotToleranceDefaultWithin);

  //       // check diff results
  //       assert.isAtMost(result.misMatchPercentage, this.misMatchTolerance, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isTrue(result.isWithinMisMatchTolerance, 'Diff should be in tolerance');

  //       // check if diff image was not created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isFalse(existsDiff, 'Diff screenshot should not exist');
  //     });

  //     it('reports diff when NOT in tolerance', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotToleranceDefaultOutside);

  //       // check diff results
  //       assert.isAbove(result.misMatchPercentage, this.misMatchTolerance, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isFalse(result.isWithinMisMatchTolerance, 'Images should be marked as diff');

  //       // check if diff image was created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isTrue(existsDiff, 'Diff screenshot should exist');
  //     });
  //   });

  //   context('uses custom misMatchTolerance passed in constructor option', function() {
  //     beforeEach(async function() {
  //       this.misMatchTolerance = 0.25;
  //       this.context = {};

  //       localCompare = new LocalCompare({
  //         screenshotName: this.getScreenshotFile,
  //         referenceName: this.getReferenceFile,
  //         diffName: this.getDiffFile,
  //         misMatchTolerance: this.misMatchTolerance,
  //       });

  //       // 1st run -> create reference
  //       await localCompare.processScreenshot({}, this.screenshotBase);

  //       // check if reference was created
  //       const existsReference = await fs.exists(this.screenshotFile);
  //       assert.isTrue(existsReference, 'Captured screenshot should exist');
  //     });

  //     it('reports equal when in tolerance', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotToleranceCustomWithin);

  //       // check diff results
  //       assert.isAtMost(result.misMatchPercentage, this.misMatchTolerance, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isTrue(result.isWithinMisMatchTolerance, 'Diff should be in tolerance');

  //       // check if diff image was not created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isFalse(existsDiff, 'Diff screenshot should not exist');
  //     });

  //     it('reports diff when NOT in tolerance', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotToleranceCustomOutside);

  //       // check diff results
  //       assert.isAbove(result.misMatchPercentage, this.misMatchTolerance, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isFalse(result.isWithinMisMatchTolerance, 'Images should be marked as diff');

  //       // check if diff image was created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isTrue(existsDiff, 'Diff screenshot should exist');
  //     });
  //   });

  //   context('uses custom misMatchTolerance passed in command options', function() {
  //     beforeEach(async function() {
  //       this.misMatchTolerance = 0.25;
  //       this.context = {
  //         options: {
  //           misMatchTolerance: this.misMatchTolerance,
  //         },
  //       };

  //       localCompare = new LocalCompare({
  //         screenshotName: this.getScreenshotFile,
  //         referenceName: this.getReferenceFile,
  //         diffName: this.getDiffFile,
  //       });

  //       // 1st run -> create reference
  //       await localCompare.processScreenshot({}, this.screenshotBase);

  //       // check if reference was created
  //       const existsReference = await fs.exists(this.screenshotFile);
  //       assert.isTrue(existsReference, 'Captured screenshot should exist');
  //     });

  //     it('reports equal when in tolerance', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotToleranceCustomWithin);

  //       // check diff results
  //       assert.isAtMost(result.misMatchPercentage, this.misMatchTolerance, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isTrue(result.isWithinMisMatchTolerance, 'Diff should be in tolerance');

  //       // check if diff image was not created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isFalse(existsDiff, 'Diff screenshot should not exist');
  //     });

  //     it('reports diff when NOT in tolerance', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotToleranceCustomOutside);

  //       // check diff results
  //       assert.isAbove(result.misMatchPercentage, this.misMatchTolerance, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isFalse(result.isWithinMisMatchTolerance, 'Images should be marked as diff');

  //       // check if diff image was created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isTrue(existsDiff, 'Diff screenshot should exist');
  //     });
  //   });
  // });

  // context('ignoreComparison', function() {
  //   before(async function() {
  //     this.screenshotRed = await readAsBase64(path.join(dirFixture, 'ignoreComparison/100x100-red.png'));
  //     this.screenshotRed2 = await readAsBase64(path.join(dirFixture, 'ignoreComparison/100x100-red2.png'));
  //   });

  //   beforeEach(async function() {
  //     this.screenshotFile = path.join(dirTmp, 'screenshot.png');
  //     this.referencFile = path.join(dirTmp, 'reference.png');
  //     this.diffFile = path.join(dirTmp, 'diff.png');

  //     this.getScreenshotFile = stub().returns(this.screenshotFile);
  //     this.getReferenceFile = stub().returns(this.referencFile);
  //     this.getDiffFile = stub().returns(this.diffFile);
  //   });

  //   context('uses default ignoreComparison', function() {
  //     beforeEach(async function() {
  //       this.context = {};

  //       localCompare = new LocalCompare({
  //         screenshotName: this.getScreenshotFile,
  //         referenceName: this.getReferenceFile,
  //         diffName: this.getDiffFile,
  //       });

  //       // 1st run -> create reference
  //       await localCompare.processScreenshot({}, this.screenshotRed);

  //       // check if reference was created
  //       const existsReference = await fs.exists(this.screenshotFile);
  //       assert.isTrue(existsReference, 'Captured screenshot should exist');
  //     });

  //     it('reports diff when colors differs', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotRed2);

  //       // check diff results
  //       assert.isAbove(result.misMatchPercentage, 0, 'Images should diff');
  //       assert.isFalse(result.isExactSameImage, 'Images should diff');
  //       assert.isFalse(result.isWithinMisMatchTolerance, 'Diff should not be in tolerance');

  //       // check if diff image was created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isTrue(existsDiff, 'Diff screenshot should exist');
  //     });
  //   });

  //   context('uses custom ignoreComparison passed in constructor option', function() {
  //     beforeEach(async function() {
  //       this.ignoreComparison = 'colors';
  //       this.context = {};

  //       localCompare = new LocalCompare({
  //         screenshotName: this.getScreenshotFile,
  //         referenceName: this.getReferenceFile,
  //         diffName: this.getDiffFile,
  //         ignoreComparison: this.ignoreComparison,
  //       });

  //       // 1st run -> create reference
  //       await localCompare.processScreenshot({}, this.screenshotRed);

  //       // check if reference was created
  //       const existsReference = await fs.exists(this.screenshotFile);
  //       assert.isTrue(existsReference, 'Captured screenshot should exist');
  //     });

  //     it('reports equal with ignoreComparison=colors when colors differs', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotRed2);
  //       // check diff results
  //       assert.isTrue(result.isExactSameImage, 'Images should not diff');
  //       assert.isTrue(result.isWithinMisMatchTolerance, 'Diff should be in tolerance');

  //       // check if diff image was not created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isFalse(existsDiff, 'Diff screenshot should not exist');
  //     });
  //   });

  //   context('uses custom ignoreComparison passed in command options', function() {
  //     beforeEach(async function() {
  //       this.ignoreComparison = 'colors';
  //       this.context = {
  //         options: {
  //           ignoreComparison: this.ignoreComparison,
  //         },
  //       };

  //       localCompare = new LocalCompare({
  //         screenshotName: this.getScreenshotFile,
  //         referenceName: this.getReferenceFile,
  //         diffName: this.getDiffFile,
  //       });

  //       // 1st run -> create reference
  //       await localCompare.processScreenshot({}, this.screenshotRed);

  //       // check if reference was created
  //       const existsReference = await fs.exists(this.screenshotFile);
  //       assert.isTrue(existsReference, 'Captured screenshot should exist');
  //     });

  //     it('reports equal with ignoreComparison=colors when colors differs', async function() {
  //       // compare screenshots
  //       const result = await localCompare.processScreenshot(this.context, this.screenshotRed2);

  //       // check diff results
  //       assert.isTrue(result.isExactSameImage, 'Images should not diff');
  //       assert.isTrue(result.isWithinMisMatchTolerance, 'Diff should be in tolerance');

  //       // check if diff image was not created
  //       const existsDiff = await fs.exists(this.diffFile);
  //       assert.isFalse(existsDiff, 'Diff screenshot should not exist');
  //     });
  //   });
  // });
});
