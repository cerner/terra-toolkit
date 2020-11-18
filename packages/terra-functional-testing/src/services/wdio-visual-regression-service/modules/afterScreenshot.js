import logger from '@wdio/logger';

import scrollbars from '../scripts/scrollbars';
import modifyElements from '../scripts/modifyElements';

const log = logger('wdio-visual-regression-service:after');

/**
 * Helper method to prepare the dom for a screenshot by removing scroll bars, hiding and/or removing any elements
 * indicated in the options and setting the scroll position to 0,0.
 *
 * @param {Object} browser - The global webdriver.io WebDriver instance.
 * @param {Object=} options - The screenshot capturing and comparison options.
 * @param {String[]} options.hide - The list of elements to set opacity 0 on to 'hide' from the dom when capturing the screenshot.
 * @param {String[]} options.remove - The list of elements to set display: none on to 'remove' from dom when capturing the screenshot.
 * @returns {undefined}
 */
export default async function beforeScreenshot(browser, options = {}) {
  const { hide, remove } = options;

  // show elements
  if (Array.isArray(hide) && hide.length) {
    log.info('show the following elements again: %s', hide.join(', '));
    await browser.execute(modifyElements, hide, 'opacity', '');
  }

  // add elements again
  if (Array.isArray(remove) && remove.length) {
    log.info('add the following elements again: %s', remove.join(', '));
    await browser.execute(modifyElements, remove, 'display', '');
  }

  // show scrollbars
  log.info('show scrollbars again');
  await browser.execute(scrollbars, true);
}
