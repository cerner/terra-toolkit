import fs from 'fs-extra';
import resemble from 'node-resemble-js';
import _ from 'lodash';
import path from 'path';
import logger from '@wdio/logger';

import BaseCompare from './BaseCompare';
import terraViewports from '../../../utils/viewports';

const log = logger('wdio-visual-regression-service:LocalCompare');

const TEST_ID_REGEX = /\[([^)]+)\]/;

export default class LocalCompare extends BaseCompare {
  constructor(options = {}) {
    super();
    const {
      baseScreenshotDir,
      formFactor,
      ignoreComparison,
      locale,
      misMatchTolerance,
      theme,
    } = options;

    this.baseScreenshotDir = baseScreenshotDir;
    this.formFactor = formFactor;
    this.locale = locale;
    this.theme = theme;
    this.misMatchTolerance = misMatchTolerance;
    this.ignoreComparison = ignoreComparison;
  }

  // eslint-disable-next-line class-methods-use-this
  createTestName(fullName) {
    const matches = TEST_ID_REGEX.exec(fullName);

    // If test ID is provided, use the ID for a shorter test name, otherwise use the full name
    let name = matches ? matches[1] : fullName.trim();

    // Remove white space
    name = name.replace(/[\s+.]/g, '_');

    // Remove windows reserved characters. See: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#naming_conventions
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\?\<\>\/\\|\*\"\:\+\.]/g, '-');

    return name;
  }

  getScreenshotName(context) {
    const { name } = (context.options || {});
    const parentName = this.createTestName(context.test.parent);
    const testName = this.createTestName(name || context.test.title);

    return `${parentName}[${testName}].png`;
  }

  getFormFactor(browserWidth) {
    if (this.formFactor !== undefined) {
      return this.formFactor;
    }

    // Default to enormous then check if the current viewport is a small form factor
    let formFactor = 'enormous';

    const viewportSizes = Object.keys(terraViewports);
    for (let form = 0; form < viewportSizes.length; form += 1) {
      const viewportName = viewportSizes[form];
      if (browserWidth <= terraViewports[viewportName].width) {
        formFactor = viewportName;
        break;
      }
    }

    return formFactor;
  }

  getScreenshotDir(context) {
    const { desiredCapabilities, meta } = context;
    const { browserName } = desiredCapabilities;
    const browserWidth = meta.viewport.width;

    const formFactor = this.getFormFactor(browserWidth);
    const testForm = `${browserName}_${formFactor}`;
    const testSpec = path.parse(context.test.file).name;

    return path.join(testForm, testSpec);
  }

  getScreenshotPaths(context) {
    let [, specPath] = path.dirname(context.test.file).split(process.cwd());

    // Added to allow for test reusability from terra repositories
    if (specPath.includes('node_modules')) {
      [, specPath] = specPath.split('node_modules');
    }

    const baseScreenshotPath = path.join(this.baseScreenshotDir, specPath, '__snapshots__');
    const screenshotPath = path.join(this.theme, this.locale, this.getScreenshotDir(context), this.getScreenshotName(context));
    return {
      referencePath: path.join(baseScreenshotPath, 'reference', screenshotPath),
      latestPath: path.join(baseScreenshotPath, 'latest', screenshotPath),
      diffPath: path.join(baseScreenshotPath, 'diff', screenshotPath),
    };
  }

  async processScreenshot(context, base64Screenshot) {
    const {
      referencePath,
      latestPath,
      diffPath,
    } = this.getScreenshotPaths(context);

    await fs.outputFile(latestPath, base64Screenshot, 'base64');

    const referenceExists = await fs.exists(referencePath);

    if (referenceExists) {
      log.info('reference exists, compare it with the taken now');
      const latestScreenshot = new Buffer.from(base64Screenshot, 'base64'); // eslint-disable-line new-cap
      const ignoreComparison = _.get(context, 'options.ignoreComparison', this.ignoreComparison);

      const compareData = await this.compareImages(referencePath, latestScreenshot, ignoreComparison);

      const { isSameDimensions } = compareData;
      const misMatchPercentage = Number(compareData.misMatchPercentage);
      const misMatchTolerance = _.get(context, 'options.misMatchTolerance', this.misMatchTolerance);

      if (misMatchPercentage > misMatchTolerance) {
        log.info(`Image is different! ${misMatchPercentage}%`);
        const png = compareData.getDiffImage().pack();
        await this.writeDiff(png, diffPath);

        return this.createResultReport(misMatchPercentage, false, isSameDimensions);
      } else { // eslint-disable-line no-else-return
        log.info('Image is within tolerance or the same');
        await fs.remove(diffPath);

        return this.createResultReport(misMatchPercentage, true, isSameDimensions);
      }
    } else { // eslint-disable-line no-else-return
      log.info('first run - create reference file');
      await fs.outputFile(referencePath, base64Screenshot, 'base64');
      return this.createResultReport(0, true, true);
    }
  }

  /**
   * Compares the latest image to the latest image with resemble to determine if they are the same.
   * @param {Buffer|string} reference - path to reference file or buffer for the reference image
   * @param {Buffer|string} latest - path to file or buffer of the latest image
   * @param {String} ignoreComparison - the image comparison algorithm to use
   * @return {{misMatchPercentage: Number, isSameDimensions: Boolean, getImageDataUrl: function}}
   */
  // eslint-disable-next-line class-methods-use-this
  async compareImages(reference, latest, ignoreComparison = '') {
    return await new Promise(resolve => { // eslint-disable-line no-return-await
      const image = resemble(reference).compareTo(latest);

      switch (ignoreComparison) { // eslint-disable-line default-case
        case 'colors':
          image.ignoreColors();
          break;
        case 'antialiasing':
          image.ignoreAntialiasing();
          break;
      }

      image.onComplete(data => {
        resolve(data);
      });
    });
  }

  /**
   * Writes provided diff by resemble as png
   * @param  {Stream} png node-png file Stream.
   * @return {Promise}
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
