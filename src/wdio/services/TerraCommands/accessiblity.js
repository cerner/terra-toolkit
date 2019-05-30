/**
 * Runs the custom wdio accessibility command and asserts no violations were found.
 *
 * See https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#api-name-axerun
 *
 * @param {Object} [options] - the Axe test options
 * @param {Object} [options.rules] - the axe rules to use to assert accessibility.
 * @param {Object[]} [options.viewports] - the list of Terra viewports to test.
 */
const runAccessibilityTest = (options) => {
  const axeResults = global.browser.axe(options);
  global.expect(axeResults).to.be.accessible();
};

/**
* A mocha-chai `it` block to assert accessibility.
*
* @param {Object} [options] - the Axe test options
* @param {Object} [options.rules] - the axe rules to use to assert accessibility.
* @param {Object[]} [options.viewports] - the list of Terra viewports to test.
*/
const itIsAccessible = (args) => {
  global.it('is accessible', () => {
    runAccessibilityTest(args);
  });
};

const methods = {
  itIsAccessible,
  runAccessibilityTest,
};

export default methods;
