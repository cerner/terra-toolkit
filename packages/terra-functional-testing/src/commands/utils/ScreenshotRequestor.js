const path = require('path');
const archiver = require('archiver');
const extract = require('extract-zip');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const FormData = require('form-data');
const { Logger } = require('@cerner/terra-cli');
const MemoryStream = require('./MemoryStream');

const logger = new Logger({ prefix: '[terra-functional-testing:screenshotRequestor]' });

/**
 * Class to manage downloading the existing reference screenshots from the remote repository, zip up the new reference screenshots, and upload it to the remote repository.
 */
class ScreenshotRequestor {
  /**
   * Constructor for ScreenshotRequestor.
   * @param {Object} config the config that contains information needed to download and upload screenshots from the remote repository
   * @param {string} config.latestScreenshotsPath the path to the latest screenshots. This is used for uploading.
   * @param {string} config.referenceScreenshotsPath the path to the reference screenshots. This is used for downloading.
   * @param {string} config.serviceAuthHeader - the auth header to use when making the download and upload requests.
   * @param {string} config.serviceUrl - the url to use when making the download and upload requests.
   * @param {string} config.url - the url where the screenshots will downloaded from and uploaded to.
   * @param {string} config.zipFilePath - the path to the zipped screenshot file
   */
  constructor(config) {
    const {
      latestScreenshotsPath,
      referenceScreenshotsPath,
      serviceAuthHeader,
      serviceUrl,
      url,
      zipFilePath,
    } = config;

    this.latestScreenshotsPath = latestScreenshotsPath;
    this.referenceScreenshotsPath = referenceScreenshotsPath;
    this.serviceAuthHeader = serviceAuthHeader;
    this.serviceUrl = serviceUrl;
    this.url = url;
    this.zipFilePath = zipFilePath;
  }

  /**
   * Checks the status of the response. Will return the response if it is 'ok' or if the status code is in the list of allowed codes. Otherwise, will throw an error
   * @param {*} response - the response to check
   * @param {Array} allowedStatusCodes - the allowed status codes
   */
  static checkStatus(response, allowedStatusCodes = []) {
    if (response.ok || allowedStatusCodes.includes(response.status)) {
      return response;
    }
    throw new Error(response.statusText);
  }

  /**
   * Deletes the existing screenshots
   * @param {string} referenceName - the name of the reference screenshots file to download
   */
  async deleteExistingScreenshots(referenceName) {
    const response = await fetch(
      `${this.serviceUrl}${referenceName}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: this.serviceAuthHeader,
        },
      },
    );

    // Allow 404s because that just means the screenshots don't exists yet.
    ScreenshotRequestor.checkStatus(response, [404]);
    logger.info('Existing screenshots deleted from remote repository.');
  }

  /**
   * Deletes the zipped latest screenshots
   */
  deleteZippedLatestScreenshots() {
    const archiveName = path.join(this.zipFilePath, 'latest.zip');
    fs.removeSync(archiveName);
  }

  /**
   * Makes string to return for the screenshots to save and download
   * Naming convention is {theme}-{locale}-{browser}-{formfactor} and if provided string is empty does not add it.
   * @param {string} locale - the locale to use when downloading
   * @param {string} theme - the theme to use when downloading
   * @param {string} formFactor - the formFactor to use when downloading
   * @param {string} browser - the browser to use when uploading
   */
  makeReferenceName(locale, theme, formFactor, browser) {
    const referenceName = [theme, locale, browser, formFactor].filter(function(str) {
      if(str !== '' || str != undefined) { return str}
    })
    .join("-");
    return referenceName;
  }

  /**
   * Zips the latest screenshots.
   */
  async zipLatestScreenshots() {
    const archiveName = path.join(this.zipFilePath, 'latest.zip');
    const writeStream = fs.createWriteStream(archiveName);
    const archive = archiver('zip');

    archive.pipe(writeStream);
    archive.directory(this.latestScreenshotsPath, false);
    await archive.finalize();
  }

  /**
   * Zips the build directory to memory and returns it as a MemoryStream
   */
  async zipDirectoryToMemory() {
    const archive = archiver('zip');
    const memoryStream = new MemoryStream({ highWaterMark: 10 * 1024 * 1024 * 1024 });

    archive.pipe(memoryStream);

    const archiveName = path.join(this.zipFilePath, 'latest.zip');

    // Name the uploaded file the passed referenceName since the latest screenshots will now be used as the reference screenshots.
    archive.file(archiveName, { name: 'reference.zip' });

    await archive.finalize();

    logger.info('Memory stream created');
    return memoryStream;
  }

  /**
   * Downloads the screenshots and unzip it to the reference screenshot directory defined by referenceScreenshotsPath.
   * @param {string} referenceName - the name of the reference screenshots file to download
   */
  async downloadScreenshots(referenceName) {
    let archiveUrl;
    let fetchOptions;
    if (this.serviceAuthHeader !== undefined) {
      archiveUrl = `${this.serviceUrl}${referenceName}/reference.zip`;
      fetchOptions = {
        method: 'GET',
        headers: {
          Authorization: this.serviceAuthHeader,
        },
      };
    } else {
      archiveUrl = `${this.url}${referenceName}/reference.zip`;
      fetchOptions = {
        method: 'GET',
      };
    }
    const response = await fetch(
      archiveUrl,
      fetchOptions,
    );

    if (response.status === 404) {
      logger.info(`No screenshots downloaded from ${this.url}${referenceName}. Either the URL is invalid or no screenshots were previously uploaded.`);
      return;
    }

    ScreenshotRequestor.checkStatus(response);

    await new Promise((resolve, reject) => {
      try {
        const writeStream = fs.createWriteStream('terra-wdio-screenshots.zip');
        response.body.pipe(writeStream);

        writeStream.on('finish', async () => {
          await extract('terra-wdio-screenshots.zip', { dir: this.referenceScreenshotsPath });
          fs.removeSync('terra-wdio-screenshots.zip');
          logger.info(`Screenshots downloaded from ${this.url}${referenceName}`);
          resolve();
        });
      } catch (error) {
        fs.removeSync('terra-wdio-screenshots.zip');
        logger.error(`Error occurred while extracting screenshots. ${error}`);
        reject();
      }
    });
  }

  /**
   * Uploads the site zip contained in memoryStream
   * @param {MemoryStream} memoryStream - the MemoryStream to use when uploading
   * @param {string} referenceName - the name of the reference zip to use when uploading
   */
  async uploadScreenshots(memoryStream, referenceName) {
    const formData = new FormData();
    formData.append('file', memoryStream, { filename: 'reference.zip', knownLength: memoryStream.length });
    const response = await fetch(
      `${this.serviceUrl}${referenceName}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: this.serviceAuthHeader,
        },
        body: formData,
      },
    );
    ScreenshotRequestor.checkStatus(response);

    logger.info(`Screenshots are uploaded to ${this.url}${referenceName}`);
  }

  /**
   * Downloads the screenshots.
   * @param {string} locale - the locale to use when downloading
   * @param {string} theme - the theme to use when downloading
   * @param {string} formFactor - the formFactor to use when downloading
   * @param {string} browser - the browser to use when uploading
   */
  async download(locale, theme, formFactor, browser) {
    const referenceName = this.makeReferenceName(locale, theme, formFactor, browser);
    await this.downloadScreenshots(referenceName);
  }

  /**
   * Uploads the screenshots by deleting the existing screenshots, zipping the new ones, and uploading it
   * @param {string} locale - the locale to use when uploading
   * @param {string} theme - the theme to use when uploading
   * @param {string} formFactor - the formFactor to use when uploading
   * @param {string} browser - the browser to use when uploading
   */
  async upload(locale, theme, formFactor, browser) {
    const referenceName = this.makeReferenceName(locale, theme, formFactor, browser);
    // Delete the existing screenshots from the remote repository because new screenshots will be uploaded.
    await this.deleteExistingScreenshots(referenceName);

    // Zip up the existing latest screenshots
    await this.zipLatestScreenshots();

    // Create a write stream to upload the zipped screenshots.
    const memoryStream = await this.zipDirectoryToMemory();

    // Upload the screenshots to the remote repository
    await this.uploadScreenshots(memoryStream, referenceName);

    // The zipped latest screenshots can now be safely deleted.
    this.deleteZippedLatestScreenshots();
  }
}

module.exports = ScreenshotRequestor;
