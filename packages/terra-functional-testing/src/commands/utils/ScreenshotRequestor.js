const archiver = require('archiver');
const extract = require('extract-zip');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');
const { Logger } = require('@cerner/terra-cli');
const MemoryStream = require('./MemoryStream');

const logger = new Logger({ prefix: '[terra-functional-testing:screenshotRequestor]' });

/**
 * Class to manage downloading and uploading screenshots to nexus. Consumers should call screenshotRequestor to download the existing reference screenshots, zip up the new reference screenshots, and upload it to nexus
 */
class ScreenshotRequestor {
  /**
   * Constructor for public site. Takes the config and creates:
   * - url - the public facing URL where the screenshots ends up
   * - referenceScreenshotsPath - the output path from which to upload the screenshots
   * - serviceUrl - the URL for uploading
   * - serviceAuthHeader - the auth header for uploading
   * @param {Object} config the config to use when constructing the publish site object
   * @param {string} config.referenceScreenshotsPath the path to the reference screenshots
   * @param {string} config.serviceAuthHeader - the auth header to use when calling the service
   * @param {string} config.serviceUrl - the url to use when calling the service
   * @param {string} config.url - the url where the site will end up
   * @param {string} config.zipFilePath - the path to the zip screenshot file
   */
  constructor(config) {
    const {
      referenceScreenshotsPath,
      serviceAuthHeader,
      serviceUrl,
      url,
      zipFilePath,
    } = config;

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
   */
  async deleteExistingScreenshots() {
    const response = await fetch(
      this.serviceUrl,
      {
        method: 'DELETE',
        headers: {
          Authorization: this.serviceAuthHeader,
        },
      },
    );
    // Allow 404s because that just means the screenshots don't exists yet.
    ScreenshotRequestor.checkStatus(response, [404]);
    logger.info('Existing screenshots deleted from remotw repository');
  }

  /**
   * Deletes the zipped reference screenshots
   */
  deleteZipReferenceScreenshots() {
    const archiveName = path.join(this.zipFilePath, 'reference.zip');
    fs.removeSync(archiveName);

    logger.info('Zip file deleted');
  }

  /**
   * Zips the reference screenshots.
   */
  async zipReferenceScreenshots() {
    const archiveName = path.join(this.zipFilePath, 'reference.zip');
    const writeStream = fs.createWriteStream(archiveName);
    const archive = archiver('zip');

    archive.pipe(writeStream);
    archive.directory(this.referenceScreenshotsPath, false);
    await archive.finalize();

    logger.info('Zip file created');
  }

  /**
   * Zips the build directory to memory and returns it as a MemoryStream
   */
  async zipDirectoryToMemory() {
    const archive = archiver('zip');
    const memoryStream = new MemoryStream({ highWaterMark: 10 * 1024 * 1024 * 1024 });

    archive.pipe(memoryStream);

    const archiveName = path.join(this.zipFilePath, 'reference.zip');
    archive.file(archiveName, { name: 'reference.zip' });

    await archive.finalize();

    logger.info('Memory stream created');
    return memoryStream;
  }

  /**
   * Downloads the screenshots
   */
  async downloadScreenshots() {
    const archiveUrl = `${this.serviceUrl}/reference.zip`;
    const response = await fetch(
      archiveUrl,
      {
        method: 'GET',
        headers: {
          Authorization: this.serviceAuthHeader,
        },
      },
    );

    if (response.status === 404) {
      logger.info(`No screenshots downloaded from ${this.url}. Either the URL is invalid or no screenshots were previously uploaded.`);
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
          logger.info(`Screenshots downloaded from ${this.url}`);
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
   */
  async uploadScreenshots(memoryStream) {
    const formData = new FormData();
    formData.append('file', memoryStream, { filename: 'reference.zip', knownLength: memoryStream.length });
    const response = await fetch(
      this.serviceUrl,
      {
        method: 'PUT',
        headers: {
          Authorization: this.serviceAuthHeader,
        },
        body: formData,
      },
    );
    ScreenshotRequestor.checkStatus(response);

    logger.info(`Screenshots uploaded to ${this.url}`);
  }

  /**
   * Downloads the screenshots and unzip it.
   */
  async download() {
    await this.downloadScreenshots();
  }

  /**
   * Uploads the screenshots by deleting the existing screenshots, zipping the new ones, and uploading it
   */
  async upload() {
    // Delete the existing screenshots from the remote repository because new screenshots will be uploaded.
    await this.deleteExistingScreenshots();

    // Zip up the existing reference screenshots
    await this.zipReferenceScreenshots();

    // Create a write stream to upload the zipped screenshots.
    const memoryStream = await this.zipDirectoryToMemory();

    // Upload the screenshots to the remote repository
    await this.uploadScreenshots(memoryStream);

    // The zipped screenshots can now be safely deleted.
    this.deleteZipReferenceScreenshots();
  }
}

module.exports = ScreenshotRequestor;
