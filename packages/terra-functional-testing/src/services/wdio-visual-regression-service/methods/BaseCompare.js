/* eslint-disable class-methods-use-this, no-unused-vars */
import path from 'path';


const TEST_ID_REGEX = /\[([^)]+)\]/;

export default class BaseCompare {
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
   * @param {Object} context - information provided to process the screenshot
   * @param {Object} context.browser - { name, version, userAgent }
   * @param {Object} context.suite - the test suite that is running
   * @param {Object} context.test - the test that is running
   * @param {Object} context.meta - { element, exclude, hide, remove, viewport}
   * @param {*} base64Screenshot - the screenshot captured by the selenium command to process.
   */
  async processScreenshot(_context, _base64Screenshot) {
    return Promise.resolve();
  }

  /**
   * Creates the sanitized test name for the screenshot.
   * @param {String} fullName - test name
   * @returns {String} test name
   */
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

  /**
   * Creates the PNG file name for a screenshot.
   * @param {Object} context - compare context provided by VisualRegressionLauncher.
   * @returns {String} full screenshot name with png extension
   */
  getScreenshotName(context) {
    const { name } = (context.options || {});
    const parentName = this.createTestName(context.test.parent);
    const testName = this.createTestName(name || context.test.title);

    return `${parentName}[${testName}].png`;
  }

  /**
   * Determines the directories to save the screenshot to.
   * @param {Object} context - compare context provided by VisualRegressionLauncher.
   * @returns {String} screenshot directory path
   */
  getScreenshotDir(context) {
    const { browser, meta } = context;

    const formFactor = meta.currentFormFactor;
    const testForm = `${browser.name}_${formFactor}`;
    const testSpec = path.parse(context.test.file).name;

    return path.join(this.theme, this.locale, testForm, testSpec);
  }

  /**
   * Determines the reference, latest and diff screenshot names.
   * @param {Object} context - compare context provided by VisualRegressionLauncher.
   * @returns {Object} { referencePath, latestPath, diffPath }
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
   * @param {Boolean} referenceExists - whether or not the screenshot was just created
   * @param {Number} misMatchPercentage - the percent mismatched of the latest screenshot compared to the reference screenshot
   * @param {Boolean} isWithinMisMatchTolerance - whether or not the latest screenshot is a close enough match the reference screenshot
   * @param {Boolean} isSameDimensions - whether or not the latest screenshot was the same dimensions as the reference screenshot
   * @return {{misMatchPercentage: Number,isWithinMisMatchTolerance: Boolean, isSameDimensions: Boolean, isExactSameImage: Boolean}}
   * @return {Object} the relevant comparison results
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
