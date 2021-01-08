/* global browser */
const _ = require('lodash');
const { parse } = require('platform');
const { LocalCompare } = require('./compare');
const makeElementScreenshot = require('./modules/makeElementScreenshot');
const getUserAgent = require('./scripts/getUserAgent');
const getTerraFormFactor = require('./modules/getTerraFormFactor');

class VisualRegressionLauncher {
  /**
   * @param {Object} options - Service configuration options.
   * @param {Object} options.baseScreenshotDir - The base screenshot directory path to save screenshot in.
   * @param {Object} options.locale - The locale being tested.
   * @param {Object} options.theme - The theme being tested.
   */
  constructor(options) {
    this.compare = new LocalCompare(options);
    this.context = null;
    this.currentSuite = null;
    this.currentTest = null;
  }

  /**
   * Gets executed before test execution begins. At this point you can access
   * all global variables, such as `browser`.
   * @param {object} capabilities - desiredCapabilities
   * @param {[type]} specs
   * @return null
   */
  async before() {
    const userAgent = await browser.execute(getUserAgent);
    const { name, version, ua } = parse(userAgent);

    this.context = {
      browserInfo: {
        name,
        version,
        userAgent: ua,
      },
    };

    browser.addCommand('checkElement', this.wrapCommand(browser, makeElementScreenshot));
  }

  /**
   * Hook that gets executed before the suite starts.
   * @param {Object} suite - suite details
   */
  beforeSuite(suite) {
    this.currentSuite = suite;
  }

  /**
   * Hook that gets executed after the suite has ended.
   */
  afterSuite() {
    this.currentSuite = null;
  }

  /**
   * Function to be executed before a test in Mocha.
   * @param {Object} test - test details
   */
  beforeTest(test) {
    this.currentTest = test;
  }

  /**
   * Function to be executed after a test in Mocha.
   * @param {Object} test - test details
   */
  afterTest() {
    this.currentTest = null;
  }

  /**
   * Command wrapper to setup the command with the correct context values defined from the global
   * webdriver.IO WebDriver instance.
   *
   * @param {object} browser - The global webdriver.IO WebDriver instance.
   * @param {function} command - The test command that should be executed.
   */
  wrapCommand(browser, command) {
    /**
     * The wrapped command with access to the global webdriver.IO WebDriver instance.
     *
     * @param {String} elementSelector - The css selector of the element that should be captured in the screenshot.
     * @param {Object=} options - The screenshot capturing and comparison options.
     * @param {String[]} options.hide - The list of elements to set opacity 0 on to 'hide' from the dom when capturing the screenshot.
     * @param {String[]} options.remove - The list of elements to set display: none on to 'remove' from dom when capturing the screenshot.
     * @param {String} options.ignoreComparison - The image comparison algorithm to use when processing the screenshot comparison.
     * @param {Number} options.misMatchTolerance - The acceptable mismatch tolerance the screenshot can have when processing the screenshot comparison.
     * @returns {Object} - The screenshot comparison results returned as { misMatchPercentage: Number, isSameDimensions: Boolean, getImageDataUrl: function }.
     */
    return async function wrappedScreenshotCommand(elementSelector, options) {
      let currentFormFactor;
      if (browser.isMobile) {
        currentFormFactor = await browser.getOrientation();
      } else {
        currentFormFactor = await getTerraFormFactor();
      }

      const screenshotContext = {
        browserInfo: this.context.browserInfo,
        suite: this.currentSuite,
        test: this.currentTest,
        meta: {
          currentFormFactor,
        },
      };

      const screenshotContextCleaned = _.pickBy(screenshotContext, _.identity);
      const base64Screenshot = await command(browser, elementSelector, options);
      const results = await this.compare.processScreenshot(screenshotContextCleaned, base64Screenshot);
      return results;
    }.bind(this);
  }
}

module.exports = VisualRegressionLauncher;
