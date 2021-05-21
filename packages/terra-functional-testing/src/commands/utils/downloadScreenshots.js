const extract = require('extract-zip');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { Logger } = require('@cerner/terra-cli');

const logger = new Logger({ prefix: '[terra-functional-testing:downloadScreenshots]' });

/**
 * Downloads and unzips the screenshots from provided url.
 * @param {string} screenshotUrl - The url to the repository that stores the screenshots.
 */
async function downloadScreenshots(screenshotUrl) {
  if (!screenshotUrl) {
    logger.error('A url to the screenshot registry is required to download screenshots.');
    return;
  }

  await new Promise((resolve, reject) => {
    https.get(screenshotUrl)
      .on('response', async (response) => {
        const { statusCode } = response;

        if (statusCode !== 200) {
          logger.error(`Request to retrieve screenshots failed. Status Code: ${statusCode}`);
          // Consume response data to free up memory
          response.resume();
          reject();
          return;
        }

        try {
          const writeStream = fs.createWriteStream('terra-wdio-screenshots.zip');
          response.pipe(writeStream);

          writeStream.on('finish', async () => {
            await extract('terra-wdio-screenshots.zip', { dir: path.join(process.cwd(), 'terra-wdio-screenshots') });
            fs.removeSync(path.join(process.cwd(), 'terra-wdio-screenshots.zip'));
            logger.info('Screenshot download and extraction complete.');
            resolve();
          });
        } catch (error) {
          fs.removeSync(path.join(process.cwd(), 'terra-wdio-screenshots.zip'));
          logger.error(`Error occurred while extracting screenshots. ${error}`);
          reject();
        }
      });
  });
}

module.exports = downloadScreenshots;
