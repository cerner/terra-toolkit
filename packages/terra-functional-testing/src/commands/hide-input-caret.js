const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio-terra-service]' });

/**
 * Hides the blinking input caret that appears within editable text areas to prevent inconsistent test failures.
 *
 * @param {string} selector The selector for the element to hide the caret of
 */
const hideInputCaret = (selector) => {
  if (global.browser.$(selector).isExisting()) {
    global.browser.execute(`document.querySelector("${selector.replace(/"/g, '\\"')}").style.caretColor = "transparent";`);
  } else {
    logger.error(`No element could be found with the selector '${selector}'.`);
  }
};

module.exports = hideInputCaret;
