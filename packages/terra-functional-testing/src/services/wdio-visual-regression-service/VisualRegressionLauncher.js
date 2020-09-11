/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* global browser */
import _ from 'lodash';
import { parse as parsePlatform } from 'platform';
import logger from '@wdio/logger';

import makeElementScreenshot from './modules/makeElementScreenshot';
import makeDocumentScreenshot from './modules/makeDocumentScreenshot';
import makeViewportScreenshot from './modules/makeViewportScreenshot';

import getUserAgent from './scripts/getUserAgent';
import { mapViewports, mapOrientations } from './modules/mapViewports';

const log = logger('wdio-visual-regression-service');

class VisualRegressionLauncher {
  constructor(options) {
    this.options = options;
    this.currentSuite = null;
    this.currentTest = null;
  }

  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config - wdio configuration object
   * @param {[Object]} capabilities - list of capabilities details
   */
  async onPrepare(config) {
    this.validateConfig(config);
    this.compare = this.options.compare;
    log.info('Launching onPrepare functions');
    await this.runHook('onPrepare');
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
    this.validateConfig(browser.config);

    this.compare = this.options.compare;
    this.viewportChangePause = _.get(browser.config, 'visualRegression.viewportChangePause', 100);
    this.viewports = _.get(browser.config, 'visualRegression.viewports');
    this.orientations = _.get(browser.config, 'visualRegression.orientations');
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

    await this.runHook('before', this.context);
  }

  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  beforeSuite(suite) {
    this.currentSuite = suite;
  }

  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
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
   * Gets executed after all tests are done. You still have access to all global
   * variables from the test.
   * @param  {object} capabilities - desiredCapabilities
   * @param  {[type]} specs
   * @return {Promise}
   */
  async after(capabilities, specs) {
    await this.runHook('after', capabilities, specs);
  }

  /**
   * Gets executed after all workers got shut down and the process is about to exit.
   * @param {Object} exitCode - 0 = success or 1 = fail
   * @param {Object} config - wdio configuration object
   * @param {[Object]} capabilities - list of capabilities details
   */
  async onComplete(_exitCode, _config, _capabilities) {
    await this.runHook('onComplete');
  }

  // eslint-disable-next-line consistent-return
  async runHook(hookName, ...args) {
    if (typeof this.compare[hookName] === 'function') {
      // eslint-disable-next-line no-return-await
      return await this.compare[hookName](...args);
    }
  }

  validateConfig(_config) {
    if (!_.isPlainObject(this.options) || !_.has(this.options, 'compare')) {
      throw new Error('Please provide a visualRegression configuration with a compare method in your wdio-conf.js!');
    }
  }

  wrapCommand(browser, type, command) {
    const baseContext = {
      type,
      browser: this.context.browser,
      desiredCapabilities: this.context.desiredCapabilities,
    };

    const runHook = this.runHook.bind(this);

    const getTestDetails = () => this.getTestDetails();

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
            ...getTestDetails(),
            meta,
            options,
          };

          const screenshotContextCleaned = _.pickBy(screenshotContext, _.identity);

          await runHook('beforeScreenshot', screenshotContextCleaned);

          const base64Screenshot = await command(browser, ...args);

          await runHook('afterScreenshot', screenshotContextCleaned, base64Screenshot);

          // pass the following params to next iteratee function
          return [screenshotContextCleaned, base64Screenshot];
        },
        // eslint-disable-next-line prefer-arrow-callback
        async function processScreenshot(screenshotContextCleaned, base64Screenshot) {
          // eslint-disable-next-line no-return-await
          return await runHook('processScreenshot', screenshotContextCleaned, base64Screenshot);
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
