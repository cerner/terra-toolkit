const { Logger } = require('@cerner/terra-cli');

const scroll = require('../scripts/scroll');
const scrollbars = require('../scripts/scrollbars');
const modifyElements = require('../scripts/modifyElements');
const triggerResize = require('../scripts/triggerResize');

const logger = new Logger({ prefix: '[wdio-visual-regression-service:beforeScreenshot]' });

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

  // hide scrollbars
  logger.verbose('hide scrollbars');
  await browser.execute(scrollbars, false);

  logger.verbose('trigger resize event to allow js components to resize properly');
  await browser.execute(triggerResize);

  // hide elements
  if (Array.isArray(hide) && hide.length) {
    logger.verbose('hide the following elements: %s', hide.join(', '));
    await browser.execute(modifyElements, hide, 'opacity', '0');
  }

  // remove elements
  if (Array.isArray(remove) && remove.length) {
    logger.verbose('remove the following elements: %s', remove.join(', '));
    await browser.execute(modifyElements, remove, 'display', 'none');
  }

  // scroll back to start
  const x = 0;
  const y = 0;
  logger.verbose('scroll back to start x: %s, y: %s', x, y);
  await browser.execute(scroll, x, y);

  // wait a bit for browser render
  const pause = 200;
  logger.verbose('wait %s ms for browser render', pause);
  await browser.pause(pause);
}

module.exports = beforeScreenshot;
