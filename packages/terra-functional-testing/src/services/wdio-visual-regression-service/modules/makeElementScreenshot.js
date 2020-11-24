import { Logger } from '@cerner/terra-cli';

import makeAreaScreenshot from './makeAreaScreenshot';
import beforeScreenshot from './beforeScreenshot';
import afterScreenshot from './afterScreenshot';

import groupBoundingRect from '../utils/groupBoundingRect';
import getBoundingRects from '../scripts/getBoundingRects';

const logger = new Logger('[wdio-visual-regression-service:makeDocumentScreenshot]');

/**
 * Captures a screenshot of a given element if the element is within the viewport dimensions.
 * This will remove scroll bars, hide any elements specified in the options, then take the screenshot
 * before restoring the dom to it's original position and structure.
 *
 * @alias browser.checkElement
 * @param {string=} fileName - The filename to use to save the screenshot.
 * @param {String} elementSelector - The css selector of the element that should be captured in the screenshot.
 * @param {Object=} options - The screenshot capturing and comparison options.
 * @param {String[]} options.hide - The list of elements to set opacity 0 on to 'hide' from the dom when capturing the screenshot.
 * @param {String[]} options.remove - The list of elements to set display: none on to 'remove' from dom when capturing the screenshot.
 * @returns {String} - The base64 string of the screenshot image that was captured.
 */
export default async function makeElementScreenshot(browser, elementSelector, options = {}) {
  logger.verbose('start element screenshot');

  // hide scrollbars, scroll to start, hide & remove elements, wait for render
  await beforeScreenshot(browser, options);

  // get bounding rect of elements
  const boundingRects = await browser.execute(getBoundingRects, elementSelector);
  const boundingRect = groupBoundingRect(boundingRects);

  // make screenshot of area
  const base64Image = await makeAreaScreenshot(
    browser,
    boundingRect.left,
    boundingRect.top,
    boundingRect.right,
    boundingRect.bottom,
  );

  // show scrollbars, show & add elements
  await afterScreenshot(browser, options);

  logger.verbose('end element screenshot');

  return base64Image;
}
