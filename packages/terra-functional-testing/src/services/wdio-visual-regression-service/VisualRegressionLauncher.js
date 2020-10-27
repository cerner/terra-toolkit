/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* global browser */
import _ from 'lodash';
import { parse as parsePlatform } from 'platform';

import { LocalCompare } from './compare';
import makeElementScreenshot from './modules/makeElementScreenshot';
import makeDocumentScreenshot from './modules/makeDocumentScreenshot';
import makeViewportScreenshot from './modules/makeViewportScreenshot';

import getUserAgent from './scripts/getUserAgent';
import getViewportSize from './modules/getViewportSize';

class VisualRegressionLauncher {
  /**
   * @param {Object} options - Service configuration options.
   */
  constructor(options = {}) {
    const {
      baseScreenshotDir,
      formFactor,
      locale,
      theme,
    } = options;

    this.compare = new LocalCompare({
      baseScreenshotDir,
      formFactor,
      locale,
      theme,
    });

    this.currentSuite = null;
    this.currentTest = null;
  }

  /**
   * Gets executed before test execution begins. At this point you can access
   * all global variables, such as `browser`.
   * It is the perfect place to define custom commands.
   * @param  {object} capabilities - desiredCapabilities
   * @param  {[type]} specs
   * @return {Promise}
   */
  async before(_capabilities, specs) {
    const userAgent = await browser.execute(getUserAgent);
    const { name, version, ua } = parsePlatform(userAgent);

    this.context = {
      browser: {
        name,
        version,
        userAgent: ua,
      },
      specs,
    };

    browser.addCommand('checkElement', this.wrapCommand(browser, makeElementScreenshot));
    browser.addCommand('checkDocument', this.wrapCommand(browser, makeDocumentScreenshot));
    browser.addCommand('checkViewport', this.wrapCommand(browser, makeViewportScreenshot));
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
  afterTest(_test) {
    this.currentTest = null;
  }

  /**
   * Command wrapper to setup the command with the correct context values defined from the global
   * browser instance.
   *
   * @param {object} browser - global wdio browser instance
   * @param {function} command - the test command that should be executed
   */
  wrapCommand(browser, command) {
    const baseContext = {
      browser: this.context.browser,
    };

    const testDetails = this.getTestDetails();

    const resolutionKeySingle = browser.isMobile ? 'orientation' : 'viewport';

    return async function async(...args) {
      let resolution;
      if (browser.isMobile) {
        resolution = await browser.getOrientation();
      } else {
        resolution = await getViewportSize();
      }

      const screenshotContext = {
        ...baseContext,
        ...testDetails,
        meta: {
          [resolutionKeySingle]: resolution,
        },
      };

      const screenshotContextCleaned = _.pickBy(screenshotContext, _.identity);

      const base64Screenshot = await command(browser, ...args);

      const results = await this.compare.processScreenshot(screenshotContextCleaned, base64Screenshot);
      return results;
    };
  }

  getTestDetails() {
    return _.pickBy(
      {
        suite: this.currentSuite,
        test: this.currentTest,
      },
      _.identity,
    );
  }
}

module.exports = VisualRegressionLauncher;
