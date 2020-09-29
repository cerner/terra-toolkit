/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* global browser */
import _ from 'lodash';
import { parse as parsePlatform } from 'platform';

import LocalCompare from './methods/LocalCompare';
import makeElementScreenshot from './modules/makeElementScreenshot';
import makeDocumentScreenshot from './modules/makeDocumentScreenshot';
import makeViewportScreenshot from './modules/makeViewportScreenshot';

import getUserAgent from './scripts/getUserAgent';
import { mapViewports, mapOrientations } from './modules/mapViewports';

class VisualRegressionLauncher {
  /**
   * @param {Object} options - Service configuration options.
   */
  constructor(options = {}) {
    const {
      baseScreenshotDir,
      formFactor,
      ignoreComparison,
      locale,
      misMatchTolerance,
      orientations,
      theme,
      viewports,
    } = options;

    this.compare = new LocalCompare({
      baseScreenshotDir, formFactor, ignoreComparison, locale, misMatchTolerance, theme,
    });

    // screenshot looping variables
    this.viewports = viewports || []; // not sure we want to support this / need this
    this.orientations = orientations || []; // not sure we want to support this / need this
    this.viewportChangePause = 100;

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
  async before(capabilities, specs) {
    const userAgent = await browser.execute(getUserAgent);
    const { name, version, ua } = parsePlatform(userAgent);

    this.context = {
      browser: {
        name,
        version,
        userAgent: ua,
      },
      desiredCapabilities: capabilities,
      specs,
    };

    browser.addCommand('checkElement', this.wrapCommand(browser, 'element', makeElementScreenshot));
    browser.addCommand('checkDocument', this.wrapCommand(browser, 'document', makeDocumentScreenshot));
    browser.addCommand('checkViewport', this.wrapCommand(browser, 'viewport', makeViewportScreenshot));
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
   * @param {string} type - the command variant. either document, element or viewport
   * @param {function} command - the test command that should be executed
   */
  wrapCommand(browser, type, command) {
    const baseContext = {
      type,
      browser: this.context.browser,
      desiredCapabilities: this.context.desiredCapabilities,
    };

    const testDetails = this.getTestDetails();

    const resolutionKeySingle = browser.isMobile ? 'orientation' : 'viewport';
    const resolutionKeyPlural = browser.isMobile ? 'orientations' : 'viewports';
    const resolutionMap = browser.isMobile ? mapOrientations : mapViewports;

    const viewportChangePauseDefault = this.viewportChangePause;
    const resolutionDefault = browser.isMobile ? this.orientations : this.viewports;

    return async function async(...args) {
      const url = await browser.getUrl();

      const elementSelector = type === 'element' ? args[0] : undefined;
      const options = _.isPlainObject(args[args.length - 1]) ? args[args.length - 1] : {};

      const { exclude, hide, remove } = options;

      const resolutions = _.get(options, resolutionKeyPlural, resolutionDefault);
      const viewportChangePause = _.get(options, 'viewportChangePause', viewportChangePauseDefault);

      const results = await resolutionMap(
        browser,
        viewportChangePause,
        resolutions,
        // eslint-disable-next-line prefer-arrow-callback
        async function takeScreenshot(resolution) {
          const meta = _.pickBy(
            {
              url,
              element: elementSelector,
              exclude,
              hide,
              remove,
              [resolutionKeySingle]: resolution,
            },
            _.identity,
          );

          const screenshotContext = {
            ...baseContext,
            ...testDetails,
            meta,
            options,
          };

          const screenshotContextCleaned = _.pickBy(screenshotContext, _.identity);

          // removes scrollbars, removes / hides elements and scrolls to top
          await this.compare.beforeScreenshot(screenshotContextCleaned);

          const base64Screenshot = await command(browser, ...args);

          // re-adds / unhides elements
          await this.compare.afterScreenshot(screenshotContextCleaned, base64Screenshot);

          // pass the following params to next iteratee function
          return [screenshotContextCleaned, base64Screenshot];
        },

        // eslint-disable-next-line prefer-arrow-callback
        async function processScreenshot(screenshotContextCleaned, base64Screenshot) {
          // eslint-disable-next-line no-return-await
          return await this.compare.processScreenshot(screenshotContextCleaned, base64Screenshot);
        },
      );
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
