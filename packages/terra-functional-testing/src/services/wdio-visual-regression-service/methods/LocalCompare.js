import fs from 'fs-extra';
import resemble from 'node-resemble-js';
import _ from 'lodash';
import logger from '@wdio/logger';

import BaseCompare from './BaseCompare';

const log = logger('wdio-visual-regression-service:LocalCompare');

export default class LocalCompare extends BaseCompare {
  constructor(options) {
    super(options);

    this.ignoreComparison = 'ignore';
    this.misMatchTolerance = 0.01;
  }

  /**
   * Process for Local Comparison of a new latest screenshot against a reference screenshot, if one exists. If the
   * two images are of a different size or are not within the mismatch tolerance, a screenshot highlighting the
   * differences will be created.
   *
   * @param {Object} context - Information provided to process the screenshot.
   * @param {Object} context.browser - Contains the browser's name, version, userAgent.
   * @param {Object} context.suite - The test suite that is running.
   * @param {Object} context.test - The test that is running.
   * @param {Object} context.meta - Contains the element, exclude, hide, remove, viewport as meta data to use.
   * @param {*} base64Screenshot - The screenshot captured by the selenium command to process.
   */
  async processScreenshot(context, base64Screenshot) {
    const {
      referencePath,
      latestPath,
      diffPath,
    } = this.getScreenshotPaths(context);

    // create latest screenshot
    await fs.outputFile(latestPath, base64Screenshot, 'base64');

    const referenceExists = fs.existsSync(referencePath);

    if (referenceExists) {
      log.info('reference screenshot exists, compare it with the taken screenshot now');
      const latestScreenshot = new Buffer.from(base64Screenshot, 'base64'); // eslint-disable-line new-cap

      const ignoreComparison = _.get(context, 'options.ignoreComparison', this.ignoreComparison);
      const compareData = await this.compareImages(referencePath, latestScreenshot, ignoreComparison);

      const { isSameDimensions } = compareData;
      const misMatchPercentage = Number(compareData.misMatchPercentage);
      const misMatchTolerance = _.get(context, 'options.misMatchTolerance', this.misMatchTolerance);

      const isWithinMisMatchTolerance = misMatchPercentage <= misMatchTolerance;
      if (!isWithinMisMatchTolerance || !isSameDimensions) {
        log.info(`Image is different! ${misMatchPercentage}%`);
        const png = compareData.getDiffImage().pack();
        await this.writeDiff(png, diffPath);
      } else {
        log.info('Image is within tolerance or the same');
        // remove diff screenshot if it existed from a previous run
        await fs.remove(diffPath);
      }

      return this.createResultReport(referenceExists, misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions);
    }

    log.info('first run - create reference file');
    await fs.outputFile(referencePath, base64Screenshot, 'base64');
    return this.createResultReport(referenceExists);
  }

  /**
   * Compares the latest image to the latest image with resemble to determine if they are the same.
   *
   * @param {Buffer|string} reference - Path to reference file or buffer for the reference image.
   * @param {Buffer|string} latest - Path to file or buffer of the latest image.
   * @param {String} ignoreComparison - The image comparison algorithm to use.
   * @returns {Object} - The screenshot comparison results returned as { misMatchPercentage: Number, isSameDimensions: Boolean, getImageDataUrl: function }.
   */
  // eslint-disable-next-line class-methods-use-this
  async compareImages(reference, screenshot, ignore = '') {
    return await new Promise(resolve => { // eslint-disable-line no-return-await
      const image = resemble(reference).compareTo(screenshot);

      switch (ignore) {
        case 'colors':
          image.ignoreColors();
          break;
        case 'antialiasing':
          image.ignoreAntialiasing();
          break;
        default:
          image.ignoreNothing();
      }

      image.onComplete(data => {
        resolve(data);
      });
    });
  }

  /**
   * Writes provided diff by resemble as png.
   *
   * @param  {Stream} -png node-png file Stream.
   * @return {Promise} - Resolves is stream is outputted successfully.
   */
  // eslint-disable-next-line class-methods-use-this
  async writeDiff(png, filepath) {
    await new Promise((resolve, reject) => { // eslint-disable-line no-return-await
      const chunks = [];
      // eslint-disable-next-line func-names, space-before-function-paren, prefer-arrow-callback
      png.on('data', function(chunk) {
        chunks.push(chunk);
      });
      png.on('end', () => {
        const buffer = Buffer.concat(chunks);

        Promise.resolve()
          .then(() => fs.outputFile(filepath, buffer.toString('base64'), 'base64'))
          .then(() => resolve())
          .catch(reject);
      });
      png.on('error', err => reject(err));
    });
  }
}
