import determineOptions from './determine-test-options';

/**
 * Runs the visual regression comparisons and assert the screenshot comparison results are
 * the same size and within the mismatch tolerance.
 *
 * This should be used within a Mocha `it` block.
 *
 * @param {string} selector - the selector to use when capturing the screenshot.
 * @param {Object} [options] - the visual regression test options. Options include viewports and misMatchTolerance
 * @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {Object} [options.viewports] - the list of Terra viewports to test.
 */
const runMatchScreenshotTest = (selector, options) => {
  const screenshots = global.browser.checkElement(selector, options);

  const { viewports } = options;
  if (viewports && viewports.length) {
    global.expect(screenshots, 'the number of screenshot results to match the number of specified viewports').to.have.lengthOf(viewports.length);

    // add viewport name for meaningful results message if a failure occurs
    viewports.forEach((viewport, index) => {
      screenshots[index].viewport = viewport.name;
    });
  }

  global.expect(screenshots).to.matchReference();
};

/**
* Mocha-chai wrapper method to capture screenshots of a specified element and assert the
* screenshot comparison results are within the mismatch tolerance.
*
* @param {[name, options]} [args] - the list of test arguments to parse.
* @param {string} [name=default] - the name of the visual regression test.
* @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
* @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for
*    the screenshot comparison.
* @param {Object} [options.viewports] - the list of Terra viewports to test.
*/
const itMatchesScreenshot = (...args) => {
  const {
    name, selector, misMatchTolerance, viewports,
  } = determineOptions.screenshotOptions(args);

  global.it(`[${name}] to be within the mismatch tolerance`, () => {
    runMatchScreenshotTest(selector, { misMatchTolerance, viewports });
  });
};

/**
 * The screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 *
 * This should be used within a Mocha `it` block.
 *
 * @param {[name, options]} [args] - the list of test arguments to parse.
 * @param {string} [name=default] - the name of the visual regression test.
 * @param {Object} [options] - the visual regression test options. Options include viewports and misMatchTolerance
 * @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for
 * @param {Object} [options.viewports] - the list of Terra viewports to test.
 */
const validatesScreenshot = (...args) => {
  const {
    name, selector, misMatchTolerance, viewports,
  } = determineOptions.screenshotOptions(args);

  runMatchScreenshotTest(selector, { misMatchTolerance, viewports, name });
};

const methods = {
  itMatchesScreenshot,
  validatesScreenshot,
  runMatchScreenshotTest,
};

export default methods;
