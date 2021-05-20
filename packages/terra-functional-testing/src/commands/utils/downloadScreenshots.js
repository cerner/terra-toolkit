const axios = require('axios').default;
const extract = require('extract-zip');
const fs = require('fs-extra');
const path = require('path');
const { Logger } = require('@cerner/terra-cli');

const logger = new Logger({ prefix: '[terra-functional-testing:downloadScreenshots]' });

/**
 * Downloads and unzips the screenshots from provided url.
 * @param {string} screenshotUrl - The url to the repository that stores the screenshots.
 */
async function downloadScreenshots(screenshotUrl) {
  if (!screenshotUrl) {
    logger.warn('A url to the screenshot registry is required to download screenshots.');
    return;
  }

  await new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: screenshotUrl,
      responseType: 'stream',
    })
      .then(async (response) => {
        response.data.pipe(fs.createWriteStream('terra-wdio-screenshots.zip'));

        try {
          await extract('terra-wdio-screenshots.zip', { dir: path.join(process.cwd(), 'terra-wdio-screenshots') });
          fs.removeSync(path.join(process.cwd(), 'terra-wdio-screenshots.zip'));
          logger.info('Screenshot download and extraction complete.');
          resolve();
        } catch (error) {
          fs.removeSync(path.join(process.cwd(), 'terra-wdio-screenshots.zip'));
          logger.error(`Error occurred while extracting screenshots. ${error}`);
          reject();
        }
      })
      .catch((error) => {
        logger.error(`Error occurred while downloading screenshots. ${error}`);
        reject();
      });
  });
}

module.exports = downloadScreenshots;
