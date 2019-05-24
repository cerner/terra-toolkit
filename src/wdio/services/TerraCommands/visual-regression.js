import determineOptions from './determine-test-options';

/**
 * The screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 * @param {String} name the test case name
 * @param {String} selector the selector to use when capturing the screenshot.
 * @param {Object} options the test options. Options include viewports and misMatchTolerance
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
* @param {Array} args - The list of test arguments to parse. Accepted Arguments:
*    - String (optional): the test case name. Default name is 'default'
*    - Object (optional): the test options. Options include selector, and viewports,
*        misMatchTolerance.
*    Note: args list order should be: name, then options when using both.
*/
const itMatchesScreenshot = (...args) => {
  const {
    name, selector, misMatchTolerance, viewports,
  } = determineOptions.screenshotOptions(args);

  global.it(`[${name}] to be within the mismatch tolerance`, () => {
    runMatchScreenshotTest(selector, { misMatchTolerance, viewports });
  });
};

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
