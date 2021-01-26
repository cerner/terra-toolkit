/* eslint-disable class-methods-use-this */
const expect = require('expect');
const { accessibility, element } = require('../commands/validates');
const { toBeAccessible } = require('../commands/expect');
const {
  describeViewports,
  getViewports,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
} = require('../commands/utils');

class TerraService {
  constructor(options = {}) {
    this.serviceOptions = options;
  }

  /**
   * Service hook executed before worker processes are launched.
   * @param {object} config - The WebdriverIO configuration object.
   */
  onPrepare(config) {
    const { serviceOptions } = config;

    this.serviceOptions = {
      theme: 'terra-default-theme',
      selector: '[data-terra-test-content] *:first-child',
      ...this.serviceOptions,
      ...serviceOptions,
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
    global.Terra.describeViewports = describeViewports;

    // Add the service options to the global.
    global.Terra.serviceOptions = this.serviceOptions;
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
    global.Terra.setApplicationLocale = setApplicationLocale;
    global.Terra.viewports = getViewports;
    global.Terra.hideInputCaret = hideInputCaret;

    // Setup and expose the validates utility functions.
    global.Terra.validates = { accessibility, element };

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
    /* Interim Fix until we update to latest hub and iedriverserver. */
    if (this.serviceOptions && this.serviceOptions.disableTerraServiceAfterCommand) {
      return;
    }

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

kodule.exports = TerraService;
