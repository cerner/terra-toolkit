/* eslint-disable class-methods-use-this */
const expect = require('expect');
const axe = require('../commands/run-axe');
const viewportHelpers = require('../commands/viewport-helpers');
const hideInputCaret = require('../commands/hide-input-caret');

class TerraService {
  /**
   * Service hook executed prior to test execution.
   * Initializes the Terra Service's custom commands.
   */
  before(capabilities) {
    global.browser.addCommand('axe', axe);

    /* Add the Jest expect module the use the Jest matchers. */
    global.expect = expect;
    /* Add a Terra global with access to Mocha-Chai test helpers. */
    global.Terra = {
      /* `viewports` provides access Terra's list of test viewports. */
      viewports: viewportHelpers.getViewports,

      /* `describeViewports` provides a custom Mocha `describe` block for looping test viewports. */
      describeViewports: viewportHelpers.describeViewports,

      /* `hideInputCaret` hides the blinking input caret that appears in inputs or editable text areas. */
      hideInputCaret,
    };

    /* IE driver takes a longer to be ready for browser interactions. */
    if (capabilities.browserName === 'internet explorer') {
      global.browser.pause(10000);
    }

    /* Set the viewport size before the spec begins. */
    viewportHelpers.setViewport(global.browser.config.formFactor);
  }

  afterCommand(commandName, args, result, error) {
    if ((commandName === 'refresh' || commandName === 'url') && !error) {
      try {
        // This is only meant as a convenience so failure is not particularly concerning
        hideInputCaret('body');

        if (global.browser.isExisting('[data-terra-dev-site-loading]')) {
          global.browser.waitUntil(() => (
            global.browser.isExisting('[data-terra-dev-site-content]')
          ), global.browser.config.waitforTimeout + 2000, '', 100);
        }
      } catch (err) {
        // intentionally blank
        // if this fails we don't want to warn because the user can't fix the issue
      }
    }
  }
}

module.exports = TerraService;
