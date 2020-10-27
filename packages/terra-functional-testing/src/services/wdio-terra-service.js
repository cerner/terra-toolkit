/* eslint-disable class-methods-use-this */
const expect = require('expect');
const { accessibility } = require('../commands/validates');
const { toBeAccessible } = require('../commands/expect');
const { getViewports, describeViewports, setViewport } = require('../commands/viewport-helpers');

const hideInputCaret = require('../commands/hide-input-caret');

class TerraService {
  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before(capabilities) {
    // Add the Jest expect module the use the Jest matchers.
    global.expect = expect;
    global.expect.extend({ toBeAccessible });

    // Add a Terra global with access to Mocha-Chai test helpers.
    global.Terra = {
      validates: { accessibility },

      // viewports provides access Terra's list of test viewports.
      viewports: getViewports,

      // describeViewports provides a custom describe block for looping test viewports.
      describeViewports,

      // hideInputCaret hides the blinking input caret that appears in inputs or editable text areas.
      hideInputCaret,
    };

    // IE driver takes longer to be ready for browser interactions.
    if (capabilities.browserName === 'internet explorer') {
      global.browser.$('body').waitForExist({
        timeout: global.browser.config.waitforTimeout,
        interval: 100,
      });
    }

    // Extract the Terra service options from the global browser object.
    const [, options = {}] = global.browser.options.services.find(([service]) => (
      typeof service === 'function' && service.name === 'TerraService'
    ));

    // Set the viewport size before the spec begins.
    setViewport(options.formFactor);
  }

  afterCommand(commandName, args, result, error) {
    if ((commandName === 'refresh' || commandName === 'url') && !error) {
      try {
        // This is only meant as a convenience so failure is not particularly concerning
        global.Terra.hideInputCaret('body');

        if (global.browser.$('[data-terra-dev-site-loading]').isExisting()) {
          global.browser.$('[data-terra-dev-site-content]').waitForExist({
            timeout: global.browser.config.waitforTimeout + 2000,
            interval: 100,
          });
        }
      } catch (err) {
        // Intentionally blank
        // If this fails we don't want to warn because the user can't fix the issue.
      }
    }
  }
}

module.exports = TerraService;
