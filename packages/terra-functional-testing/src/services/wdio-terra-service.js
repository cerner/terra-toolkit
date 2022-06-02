/* eslint-disable class-methods-use-this */
const expect = require('expect');
const { accessibility, element, screenshot } = require('../commands/validates');
const { toBeAccessible, toMatchReference } = require('../commands/expect');
const {
  describeTests,
  describeViewports,
  getViewports,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
} = require('../commands/utils');
const { BUILD_BRANCH, BUILD_TYPE } = require('../constants');

class TerraService {
  /**
   * Service constructor.
   * @param {Object} _options - The options specific to this service.
   * @param {Object} _capabilities - The list of capabilities details.
   * @param {Object} config - The object containing the wdio configuration and options defined in the terra-cli test runner.
   */
  constructor(_options, _capabilities, config = {}) {
    const { serviceOptions, launcherOptions } = config;

    this.serviceOptions = {
      selector: '[data-terra-test-content] *:first-child',
      ...launcherOptions,
      ...serviceOptions,
    };
  }

  /**
   * Service hook executed prior to initializing the webdriver session.
   */
  beforeSession() {
    global.Terra = {};

    // Add the service options to the global.
    global.Terra.serviceOptions = this.serviceOptions;

    /**
     * This command must be defined in the beforeSession hook instead of together with the other Terra custom commands in the
     * before hook. The reason being WebdriverIO v6 now executes the describe block prior to running the before hook.
     * Therefore, this command needs to be defined before the test starts in the testing life cycle.
     *
     * Reference: https://github.com/webdriverio/webdriverio/issues/6119
     */
    global.Terra.describeTests = describeTests;
    global.Terra.describeViewports = describeViewports;
    global.Terra.viewports = getViewports;
  }

  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before(capabilities) {
    // Set Jest's expect module as the global assertion framework.
    global.expect = expect;
    global.expect.extend({ toBeAccessible, toMatchReference });

    // Setup and expose global utility functions.
    global.Terra.setApplicationLocale = setApplicationLocale;
    global.Terra.hideInputCaret = hideInputCaret;

    // Setup and expose the validates utility functions.
    global.Terra.validates = { accessibility, element, screenshot };

    /**
     * Global axe override options.
     * Options modified here will be applied globally for all tests.
     */
    global.Terra.axe = {
      rules: {
        /**
         * This rule was introduced in axe-core v3.3 and causes failures in many Terra components.
         * The solution to address this failure vary by component. It is being disabled until a solution is identified in the future.
         *
         * Reference: https://github.com/cerner/terra-framework/issues/991
         */
        'scrollable-region-focusable': { enabled: false },
        /**
         * The lowlight theme adheres to a non-default color contrast ratio and fails the default ratio check.
         * The color-contrast ratio check is disabled for lowlight theme testing.
         */
        'color-contrast': { enabled: this.serviceOptions.theme !== 'clinical-lowlight-theme' },
      },
    };

    // IE driver takes longer to be ready for browser interactions.
    if (capabilities.browserName === 'internet explorer') {
      global.browser.$('body').waitForExist({
        timeout: global.browser.config.waitforTimeout,
        interval: 100,
      });
    }

    // Set the viewport size before the spec begins.
    setViewport(this.serviceOptions.formFactor || 'huge');
  }

  afterCommand(commandName, _args, _result, error) {
    if ((commandName === 'refresh' || commandName === 'url') && !error) {
      try {
        // This is only meant as a convenience so failure is not particularly concerning.
        global.Terra.hideInputCaret('body');

        if (global.browser.$('[data-terra-test-loading]').isExisting()) {
          global.browser.$('[data-terra-test-content]').waitForExist({
            timeout: global.browser.config.waitforTimeout + 2000,
            interval: 100,
          });
        }
      } catch (err) {
        // Intentionally blank. If this fails we don't want to warn because the user can't fix the issue.
      }
    }
  }

  /**
   * Gets executed once before all workers are shut down.
   * Uploads the reference screenshots to the remote repository if this build was triggered from a PR merge.
   * @param {Object} config wdio configuration object
   */
  async onComplete(_, config) {
    try {
      if (this.serviceOptions.useRemoteReferenceScreenshots && !this.serviceOptions.buildBranch.match(BUILD_BRANCH.pullRequest) && this.serviceOptions.buildType === BUILD_TYPE.branchEventCause) {
        const screenshotConfig = getRemoteScreenshotConfiguration(config.screenshotsSites, this.serviceOptions.buildBranch);
        const screenshotRequestor = new ScreenshotRequestor(screenshotConfig.publishScreenshotConfiguration);
        await screenshotRequestor.upload();
      }
    } catch (error) {
      throw new SevereServiceError(error);
    }
  }
}

module.exports = TerraService;
