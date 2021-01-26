const { assert } = require('chai');
const glob = require('glob');
const path = require('path');
const lodashGroupBy = require('lodash.groupby');
const lodashMap = require('lodash.map');
const lodashMapKeys = require('lodash.mapkeys');
const lodashMapValues = require('lodash.mapvalues');
const fsExtra = require('fs-extra');

const { normalizeScreenshot } = require('../../../../../../src/services/wdio-visual-regression-service/utils/normalizeScreenshot');
const ScreenDimension = require('../../../../../../src/services/wdio-visual-regression-service/utils/ScreenDimension');
const saveBase64Image = require('../../../../../../src/services/wdio-visual-regression-service/utils/saveBase64Image');

const compareImages = require('../../helper/compareImages');

const dimensionDesktop = require('../../../../../fixtures/dimension/desktop-scroll-both.json');

const tmpPath = path.resolve(__dirname, '..', '..', '..', '..', '..', 'tmp');
const screenshotDir = path.resolve(__dirname, '..', '..', '..', '..', '..', 'fixtures', 'screenshot');

async function readAsBase64(file) {
  // read binary data
  const content = await fsExtra.readFile(file);
  // convert binary data to base64 encoded string
  return new Buffer(content).toString('base64'); // eslint-disable-line no-buffer-constructor
}

describe('normalizeScreenshot', function() {
  context('default browser behaviour', function() {
    beforeEach(function() {
      this.browser = {
        isMobile: false,
        isIOS: false,
        isAndroid: false,
      };
      this.screenDimensions = new ScreenDimension(dimensionDesktop);
      this.base64Screenshot = 'base64Screenshot';
    });

    it('just returns the same screenshot', async function() {
      const screenshot = await normalizeScreenshot(this.browser, this.screenDimensions, this.base64Screenshot);

      assert.strictEqual(screenshot, this.base64Screenshot, 'screenshots should not be transformed');
    });
  });

  context('MacbookProRetina', function() {
    const baseDir = path.join(screenshotDir, 'MacbookProRetina');
    const files = glob.sync('**/screenshot.png', { cwd: baseDir });

    const data = files.map(file => {
      const dir = path.dirname(file);
      return {
        browserName: dir,
        screenshotFile: path.join(baseDir, file),
        expectedScreenshotFile: path.join(baseDir, dir, 'expected.png'),
        dimensionsFile: path.join(baseDir, dir, 'dimensions.json'),
        dir,
      };
    });

    lodashMap(data, ({
      browserName, screenshotFile, expectedScreenshotFile, dimensionsFile,
    }) => {
      context(browserName, function() {
        it('normalizes screenshot', async function() {
          const browser = {
            isMobile: false,
            isIOS: true,
            isAndroid: false,
          };

          const dimensions = await fsExtra.readJson(dimensionsFile);
          const base64Screenshot = await readAsBase64(screenshotFile);
          await readAsBase64(expectedScreenshotFile); // just to check if it exists
          const screenDimensions = new ScreenDimension(dimensions);

          const normalizedSreenshot = await normalizeScreenshot(browser, screenDimensions, base64Screenshot);
          const normalizedSreenshotPath = path.join(tmpPath, 'normalizeScreenshot', browserName, 'normalized.png');
          await saveBase64Image(normalizedSreenshotPath, normalizedSreenshot);

          await compareImages(normalizedSreenshotPath, expectedScreenshotFile, 0.001);
        });
      });
    });
  });

  context('iOS', function() {
    const iOSDir = path.join(screenshotDir, 'iOS');
    const files = glob.sync('**/screenshot.png', { cwd: iOSDir });

    const data = files.map(file => {
      const dir = path.dirname(file);
      const [version, device, test] = [0, 1]
        .reduce((f) => f.concat(path.dirname(f[f.length - 1])), [dir])
        .reverse()
        .map(f => path.basename(f).replace(/_/g, ' '));

      return {
        version,
        device,
        test,
        screenshotFile: path.join(iOSDir, file),
        expectedScreenshotFile: path.join(iOSDir, dir, 'expected.png'),
        dimensionsFile: path.join(iOSDir, dir, 'dimensions.json'),
        skipFile: path.join(iOSDir, dir, '.SKIP'),
        dir,
      };
    });

    const testData = lodashMapValues(lodashGroupBy(data, 'version'), list => lodashGroupBy(list, 'device'));

    lodashMapKeys(testData, (devices, version) => {
      context(version, function() {
        lodashMapKeys(devices, (list, device) => {
          context(device, function() {
            list.forEach(({
              test, screenshotFile, expectedScreenshotFile, dimensionsFile, skipFile, dir,
            }) => {
              it(test, async function() {
                const browser = {
                  isMobile: true,
                  isIOS: true,
                  isAndroid: false,
                };

                const skip = await fsExtra.exists(skipFile);
                if (skip) {
                  this.skip();
                  return;
                }
                const dimensions = await fsExtra.readJson(dimensionsFile);
                const base64Screenshot = await readAsBase64(screenshotFile);
                const screenDimensions = new ScreenDimension(dimensions, browser);

                const normalizedSreenshot = await normalizeScreenshot(browser, screenDimensions, base64Screenshot);
                const normalizedSreenshotPath = path.join(tmpPath, 'normalizeScreenshot', dir, 'normalized.png');
                await saveBase64Image(normalizedSreenshotPath, normalizedSreenshot);
                await readAsBase64(expectedScreenshotFile); // just to check if it exists

                await compareImages(normalizedSreenshotPath, expectedScreenshotFile, 0.001);
              });
            });
          });
        });
      });
    });
  });
});
