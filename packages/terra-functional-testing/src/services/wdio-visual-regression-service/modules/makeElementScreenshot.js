const { Logger } = require('@cerner/terra-cli');
const makeAreaScreenshot = require('./makeAreaScreenshot');
const beforeScreenshot = require('./beforeScreenshot');
const afterScreenshot = require('./afterScreenshot');
const groupBoundingRect = require('../utils/groupBoundingRect');
const getBoundingRects = require('../scripts/getBoundingRects');

const logger = new Logger({ prefix: '[wdio-visual-regression-service:makeDocumentScreenshot]' });

/**
 * Captures a screenshot of a given element if the element is within the viewport dimensions.
 * This will remove scroll bars, hide any elements specified in the options, then take the screenshot
 * before restoring the dom to it's original position and structure.
 *
 * @alias browser.checkElement
 * @param {string=} fileName - The filename to use to save the screenshot.
 * @param {string} elementSelector - The css selector of the element that should be captured in the screenshot.
 * @param {Object=} options - The screenshot capturing and comparison options.
 * @param {string[]} options.hide - The list of elements to set opacity 0 on to 'hide' from the dom when capturing the screenshot.
 * @param {string[]} options.remove - The list of elements to set display: none on to 'remove' from dom when capturing the screenshot.
 * @returns {string} - The base64 string of the screenshot image that was captured.
 */
async function makeElementScreenshot(browser, elementSelector, options = {}) {
  logger.verbose('start element screenshot');

  // hide scrollbars, scroll to start, hide & remove elements, wait for render
  await beforeScreenshot(browser, options);

  // get bounding rect of elements
  const boundingRects = await browser.execute(getBoundingRects, elementSelector);

  if (boundingRects.length === 0) {
    throw new Error(`[wdio-visual-regression-service:makeDocumentScreenshot] Failed to capture the element using the "${elementSelector}" selector. Either update the test document to include this selector or use a different selector that exists on the document.`);
  }

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

module.exports = makeElementScreenshot;
