/**
 * The screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 *
 * This should be used within an `it` block.
 *
 * @param {[name, options]} [args] - the list of test arguments to parse.
 * @param {string} [testName] - the required test case name.
 * @param {Object} [options] - the visual regression test options. Options include viewports and misMatchTolerance
 * @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector=global.Terra.serviceOptions.selector] - the element selector to use for
 * @param {Object} [options.viewports] - the list of Terra viewports to test.
 */
const screenshot = (testName, options = {}) => {
  if (!testName || typeof testName !== 'string' || testName.length === 0) {
    throw new Error('[terra-functional-testing:screenshot] Terra.validate.screenshot requires a test name as the first argument.');
  }

  const { selector, viewports } = options;
  const wrappedOptions = {
    name: testName,
    ...options,
  };

  const screenshotResult = global.browser.checkElement(selector || global.Terra.serviceOptions.selector, wrappedOptions);

  /*
  // TODO: Need to discuss if we want to continue to support passing down viewports too Terra.validate.screenshot.
  // If so, we need checkElements to return an array of screenshots for each passed in viewport.

  if (viewports && viewports.length) {
    global.expect(screenshotResults.length).toEqual(viewports.length);

    // Add viewport name for meaningful results message if a failure occurs
    viewports.forEach((viewport, index) => {
      screenshotResults[index].viewport = viewport.name;
    });
  }
  */

  if (viewports) {
    screenshotResult.viewport = viewports.name;
  }

  global.expect(screenshotResult).toMatchReference();
};

module.exports = screenshot;
