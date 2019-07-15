/**
 * Hides the blinking input caret that appears in editable text areas and can cause inconsistent test failues.
 *
 * @param {string} selector The selector for the element to hide the caret of
 */
const hideInputCaret = (selector) => {
  if (!global.browser.isExisting(selector)) {
    throw new Error(`No element could be found with the selector '${selector}'.`);
  }
  global.browser.execute(`document.querySelector("${selector}").style.caretColor = "transparent";`);
};

export default hideInputCaret;
