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

  const screenshots = global.browser.checkElement(selector || global.Terra.serviceOptions.selector, options);

  if (viewports && viewports.length) {
    global.expect(screenshots, 'the number of screenshot results to match the number of specified viewports').to.have.lengthOf(viewports.length);

    // add viewport name for meaningful results message if a failure occurs
    viewports.forEach((viewport, index) => {
      screenshots[index].viewport = viewport.name; // TODO: Need to add `name` to viewport
    });
  }

  global.expect(screenshots).to.matchReference(); // TODO: Add chai
};

module.exports = screenshot;
