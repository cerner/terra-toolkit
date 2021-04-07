const { Logger } = require('@cerner/terra-cli');
const scrollbars = require('../scripts/scrollbars');
const modifyElements = require('../scripts/modifyElements');

const logger = new Logger({ prefix: '[wdio-visual-regression-service:afterScreenshot]' });

/**
 * Helper method to prepare the dom for a screenshot by removing scroll bars, hiding and/or removing any elements
 * indicated in the options and setting the scroll position to 0,0.
 *
 * @param {Object} browser - The global webdriver.io WebDriver instance.
 * @param {Object=} options - The screenshot capturing and comparison options.
 * @param {string[]} options.hide - The list of elements to set opacity 0 on to 'hide' from the dom when capturing the screenshot.
 * @param {string[]} options.remove - The list of elements to set display: none on to 'remove' from dom when capturing the screenshot.
 * @returns {undefined}
 */
async function beforeScreenshot(browser, options = {}) {
  const { hide, remove } = options;

  // show elements
  if (Array.isArray(hide) && hide.length) {
    logger.verbose('show the following elements again: %s', hide.join(', '));
    await browser.execute(modifyElements, hide, 'opacity', '');
  }

  // add elements again
  if (Array.isArray(remove) && remove.length) {
    logger.verbose('add the following elements again: %s', remove.join(', '));
    await browser.execute(modifyElements, remove, 'display', '');
  }

  // show scrollbars
  logger.verbose('show scrollbars again');
  await browser.execute(scrollbars, true);
}

module.exports = beforeScreenshot;
