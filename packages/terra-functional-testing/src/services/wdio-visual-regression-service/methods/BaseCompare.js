/* eslint-disable class-methods-use-this, no-unused-vars */
import path from 'path';

/* Pattern to find the shortened test ID within braces. */
const TEST_ID_REGEX = /\[([^)]+)\]/;

export default class BaseCompare {
  /**
   * @param {Object} options - Service configuration options.
   * @param {Object} options.baseScreenshotDir - The base screenshot directory path to save screenshot in.
   * @param {Object} options.locale - The locale being tested.
   * @param {Object} options.theme - The theme being tested.
   */
  constructor(options) {
    const {
      baseScreenshotDir,
      locale,
      theme,
    } = options;

    // screenshot naming config
    this.baseScreenshotDir = baseScreenshotDir || process.cwd();
    this.locale = locale || 'en';
    this.theme = theme || 'terra-default-theme';
  }

  /**
   * The subclass extending the BaseCompare class should implement this method to perform
   * the screenshot processing appropriate for the subclass' comparison method.
   *
   * @param {Object} context - Information provided to process the screenshot.
   * @param {Object} context.browserInfo - Contains the browser's name, version, userAgent.
   * @param {Object} context.suite - The test suite that is running.
   * @param {Object} context.test - The test that is running.
   * @param {Object} context.meta - Contains the currentFormFactor as meta data to use.
   * @param {*} base64Screenshot - The screenshot captured by the selenium command to process.
   */
  async processScreenshot(_context, _base64Screenshot) {
    return Promise.resolve();
  }

  /**
   * Creates the sanitized test name for the screenshot.
   *
   * @param {String} fullName - The test name.
   * @returns {String} - The test name.
   */
  createTestName(fullName) {
    const matches = TEST_ID_REGEX.exec(fullName);

    // If test ID is provided, use the ID for a shorter test name, otherwise use the full name.
    let name = matches ? matches[1] : fullName.trim();

    // Replace white spaces with underscores.
    name = name.replace(/[\s+.]/g, '_');

    // Remove windows reserved characters. See: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#naming_conventions.
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\?\<\>\/\\|\*\"\:\+\.]/g, '-');

    return name;
  }

  /**
   * Creates the PNG file name for a screenshot.
   *
   * @param {Object} context - Compare context provided by VisualRegressionLauncher.
   * @returns {String} - Full screenshot name with png extension.
   */
  getScreenshotName(context) {
    const { name } = (context.options || {});
    const parentName = this.createTestName(context.test.parent);
    const testName = this.createTestName(name || context.test.title);

    return `${parentName}[${testName}].png`;
  }

  /**
   * Determines the directories to save the screenshot to.
   *
   * @param {Object} context - Compare context provided by VisualRegressionLauncher.
   * @param {Object} context.browserInfo - Contains the browser's name, version, userAgent.
   * @param {Object} context.meta - Contains the currentFormFactor as meta data to use.
   * @returns {String} - The screenshot directory path.
   */
  getScreenshotDir(context) {
    const { browserInfo, meta } = context;

    const formFactor = meta.currentFormFactor;
    const testForm = `${browserInfo.name}_${formFactor}`;
    const testSpec = path.parse(context.test.file).name;

    return path.join(this.theme, this.locale, testForm, testSpec);
  }

  /**
   * Determines the reference, latest and diff screenshot names.
   *
   * @param {Object} context - Compare context provided by VisualRegressionLauncher.
   * @returns {Object} - The screenshot names returned as { referencePath, latestPath, diffPath }.
   */
  getScreenshotPaths(context) {
    let [, specPath] = path.dirname(context.test.file).split(process.cwd());

    // Added to allow for test reusability from terra repositories
    if (specPath.includes('node_modules')) {
      [, specPath] = specPath.split('node_modules');
    }

    const baseScreenshotPath = path.join(this.baseScreenshotDir, specPath, '__snapshots__');
    const screenshotPath = path.join(this.getScreenshotDir(context), this.getScreenshotName(context));
    return {
      referencePath: path.join(baseScreenshotPath, 'reference', screenshotPath),
      latestPath: path.join(baseScreenshotPath, 'latest', screenshotPath),
      diffPath: path.join(baseScreenshotPath, 'diff', screenshotPath),
    };
  }

  /**
   * Creates the screenshot comparison report object.
   *
   * @param {Boolean} referenceExists - Whether or not the screenshot was just created.
   * @param {Number} misMatchPercentage - The percent mismatched of the latest screenshot compared to the reference screenshot.
   * @param {Boolean} isWithinMisMatchTolerance - Whether or not the latest screenshot is a close enough match the reference screenshot.
   * @param {Boolean} isSameDimensions - Whether or not the latest screenshot was the same dimensions as the reference screenshot.
   * @returns {Object} - The relevant comparison results to report.
   */
  createResultReport(referenceExists, misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions) {
    if (!referenceExists) {
      return { isNewScreenshot: true };
    }

    return {
      misMatchPercentage,
      isWithinMisMatchTolerance,
      isSameDimensions,
      isExactSameImage: misMatchPercentage === 0 && isSameDimensions,
    };
  }
}
