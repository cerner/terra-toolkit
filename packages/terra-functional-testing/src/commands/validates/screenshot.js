/**
 * The screenshot comparisons.  It will capture screenshots of a specified element
 * and assert the screenshot comparison results are within the mismatch tolerance or are an exact match
 *
 * This should be used within an `it` block.
 *
 * @param {[name, options]} [args] - the list of test arguments to parse.
 * @param {string} [testName] - the required test case name.
 * @param {Object} [options] - the visual regression test options. Options include viewports and selector
 * @param {Object} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector=global.Terra.serviceOptions.selector] - the element selector to use for
 */
const screenshot = (testName, options = {}) => {
  if (!testName || typeof testName !== 'string' || testName.length === 0) {
    throw new Error('[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.');
  }

  const { selector } = options;
  const wrappedOptions = {
    name: testName,
    ...options,
  };

  const screenshotResult = global.browser.checkElement(selector || global.Terra.serviceOptions.selector, wrappedOptions);

  global.expect(screenshotResult).toMatchReference();
};

module.exports = screenshot;
