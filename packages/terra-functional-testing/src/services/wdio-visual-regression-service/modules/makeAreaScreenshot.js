const fsExtra = require('fs-extra');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { Logger } = require('@cerner/terra-cli');

const ScreenshotStrategyManager = require('../utils/ScreenshotStrategyManager');
const getScreenDimensions = require('../scripts/getScreenDimensions');
const virtualScroll = require('../scripts/virtualScroll');
const pageHeight = require('../scripts/pageHeight');
const saveBase64Image = require('../utils/saveBase64Image');
const { cropImage, mergeImages } = require('../utils/image');
const ScreenDimension = require('../utils/ScreenDimension');
const { normalizeScreenshot } = require('../utils/normalizeScreenshot');

const logger = new Logger({ prefix: '[wdio-visual-regression-service:makeAreaScreenshot]' });
const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

async function storeScreenshot(browser, screenDimensions, cropDimensions, base64Screenshot, filePath) {
  const normalizedBase64Screenshot = await normalizeScreenshot(browser, screenDimensions, base64Screenshot);
  logger.verbose(
    'crop screenshot with width: %s, height: %s, offsetX: %s, offsetY: %s',
    cropDimensions.getWidth(),
    cropDimensions.getHeight(),
    cropDimensions.getX(),
    cropDimensions.getY(),
  );

  const croppedBase64Screenshot = await cropImage(normalizedBase64Screenshot, cropDimensions);

  await saveBase64Image(filePath, croppedBase64Screenshot);
}

async function makeAreaScreenshot(browser, startX, startY, endX, endY) {
  logger.verbose('requested a screenshot for the following area: %j', {
    startX, startY, endX, endY,
  });

  const screenDimensions = await browser.execute(getScreenDimensions);
  logger.verbose('detected screenDimensions %j', screenDimensions);
  const screenDimension = new ScreenDimension(screenDimensions, browser);

  const screenshotStrategy = ScreenshotStrategyManager.getStrategy(browser, screenDimension);
  screenshotStrategy.setScrollArea(startX, startY, endX, endY);

  const uuid = uuidv4();

  const dir = path.join(tmpDir, uuid);

  try {
    await fsExtra.ensureDir(dir);

    const cropImages = [];
    const screenshotPromises = [];

    logger.verbose('set page height to %s px', screenDimension.getDocumentHeight());
    await browser.execute(pageHeight, `${screenDimension.getDocumentHeight()}px`);

    let loop = false;
    do {
      const {
        x, y, indexX, indexY,
      } = screenshotStrategy.getScrollPosition();
      logger.verbose('scroll to coordinates x: %s, y: %s for index x: %s, y: %s', x, y, indexX, indexY);
      /* eslint-disable no-await-in-loop */

      await browser.execute(virtualScroll, x, y, false);
      await browser.pause(100);

      logger.verbose('take screenshot');
      const base64Screenshot = await browser.takeScreenshot();
      const cropDimensions = screenshotStrategy.getCropDimensions();
      const filePath = path.join(dir, `${indexY}-${indexX}.png`);
      /* eslint-enable no-await-in-loop */

      screenshotPromises.push(storeScreenshot(browser, screenDimension, cropDimensions, base64Screenshot, filePath));

      if (!Array.isArray(cropImages[indexY])) {
        cropImages[indexY] = [];
      }

      cropImages[indexY][indexX] = filePath;

      loop = screenshotStrategy.hasNextScrollPosition();
      screenshotStrategy.moveToNextScrollPosition();
    } while (loop);

    const [mergedBase64Screenshot] = await Promise.all([
      Promise.resolve().then(async () => {
        await Promise.all(screenshotPromises);
        logger.verbose('merge images together');
        const mergedBase64Images = await mergeImages(cropImages);
        logger.verbose('remove temp dir');
        await fsExtra.remove(dir);
        return mergedBase64Images;
      }),
      Promise.resolve().then(async () => {
        logger.verbose('reset page height');
        await browser.execute(pageHeight, '');

        logger.verbose('revert scroll to x: %s, y: %s', 0, 0);
        await browser.execute(virtualScroll, 0, 0, true);
      }),
    ]);

    return mergedBase64Screenshot;
  } catch (e) {
    try {
      await fsExtra.remove(dir);
    } catch (error) {
      // do nothing
    }

    throw e;
  }
}

module.exports = makeAreaScreenshot;
