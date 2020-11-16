import logger from '@wdio/logger';

import scroll from '../scripts/scroll';
import scrollbars from '../scripts/scrollbars';
import modifyElements from '../scripts/modifyElements';
import triggerResize from '../scripts/triggerResize';

const log = logger('wdio-visual-regression-service:beforeScreenshot');

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

  // hide scrollbars
  log.info('hide scrollbars');
  await browser.execute(scrollbars, false);

  log.info('trigger resize event to allow js components to resize properly');
  await browser.execute(triggerResize);

  // hide elements
  if (Array.isArray(hide) && hide.length) {
    log.info('hide the following elements: %s', hide.join(', '));
    await browser.execute(modifyElements, hide, 'opacity', '0');
  }

  // remove elements
  if (Array.isArray(remove) && remove.length) {
    log.info('remove the following elements: %s', remove.join(', '));
    await browser.execute(modifyElements, remove, 'display', 'none');
  }

  // scroll back to start
  const x = 0;
  const y = 0;
  log.info('scroll back to start x: %s, y: %s', x, y);
  await browser.execute(scroll, x, y);

  // wait a bit for browser render
  const pause = 200;
  log.info('wait %s ms for browser render', pause);
  await browser.pause(pause);
}
