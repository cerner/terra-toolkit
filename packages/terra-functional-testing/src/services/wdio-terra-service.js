/* eslint-disable class-methods-use-this */
const expect = require('expect');
const { accessibility, element } = require('../commands/validates');
const { toBeAccessible } = require('../commands/expect');
const {
  describeViewports,
  getViewports,
  hideInputCaret,
  setViewport,
} = require('../commands/utils');

class TerraService {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Service hook executed before worker processes are launched.
   * @param {object} config - The WebdriverIO configuration object.
   */
  onPrepare(config) {
    const { serviceOptions } = config;

    this.options = {
      theme: 'terra-default-theme',
      selector: '[data-terra-test-content] *:first-child',
      ...this.options,
      ...serviceOptions,
    };

    /**
     * Global axe override options.
     * Options modified here will be applied globally for all tests.
     */
    this.axeOptions = {
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
        'color-contrast': { enabled: this.options.theme !== 'clinical-lowlight-theme' },
      },
    };
  }

  /**
   * Service hook executed prior to initializing the webdriver session.
   */
  beforeSession() {
    global.Terra = {};

    /**
     * This command must be defined in the beforeSession hook instead of together with the other Terra custom commands in the
     * before hook. The reason being WebdriverIO v6 now executes the describe block prior to running the before hook.
     * Therefore, this command needs to be defined before the test starts in the testing life cycle.
     *
     * Reference: https://github.com/webdriverio/webdriverio/issues/6119
     */
    global.Terra.describeViewports = describeViewports.bind(null, this.options.formFactor);
  }

  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before(capabilities) {
    // Set Jest's expect module as the global assertion framework.
    global.expect = expect;
    global.expect.extend({ toBeAccessible });

    // Setup and expose global utility functions.
    global.Terra.viewports = getViewports;
    global.Terra.hideInputCaret = hideInputCaret;

    // Setup and expose the validates utility functions.
    global.Terra.validates = {};
    // Bind the default selector to ensure it is always passes as the first parameter when calling validates element.
    global.Terra.validates.element = element.bind(null, this.options.selector);
    // Bind the global axe options to ensure they are always passes as the first parameter when calling validates accessibility.
    global.Terra.validates.accessibility = accessibility.bind(null, this.axeOptions);

    // IE driver takes longer to be ready for browser interactions.
    if (capabilities.browserName === 'internet explorer') {
      global.browser.$('body').waitForExist({
        timeout: global.browser.config.waitforTimeout,
        interval: 100,
      });
    }

    // Set the viewport size before the spec begins.
    setViewport(this.options.formFactor || 'huge');
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
}

module.exports = TerraService;
