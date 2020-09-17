const Logger = require('../logger/logger');

/**
 * Hides the blinking input caret that appears within editable text areas to prevent inconsistent test failures.
 *
 * @param {string} selector The selector for the element to hide the caret of
 */
const hideInputCaret = (selector) => {
  try {
    global.browser.execute(`document.querySelector("${selector.replace(/"/g, '\\"')}").style.caretColor = "transparent";`);
  } catch (error) {
    if (!global.browser.isExisting(selector)) {
      throw Logger.error(`No element could be found with the selector '${selector}'.`);
    } else {
      throw new Error(error);
    }
  }
};

module.exports = hideInputCaret;
