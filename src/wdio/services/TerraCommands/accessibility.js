import determineOptions from './determine-test-options';

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
  const { theme } = global.browser.options;
  if (theme !== 'clinical-lowlight-theme') {
    const axeResults = global.browser.axe(options);
    global.expect(axeResults).to.be.accessible();
  }
};

/**
* A chai assertion method to assert accessibility.
*
* This should be used within a Mocha `it` block.
*
* @param {Object} [options] - the Axe test options
* @param {Object} [options.rules] - the axe rules to use to assert accessibility.
* @param {Object[]} [options.viewports] - the list of Terra viewports to test.
*/
const validatesAccessibility = (...args) => {
  runAccessibilityTest(determineOptions.axeOptions(args));
};

/**
* A mocha-chai `it` block to assert accessibility.
*
* @param {Object} [options] - the Axe test options
* @param {Object} [options.rules] - the axe rules to use to assert accessibility.
* @param {Object[]} [options.viewports] - the list of Terra viewports to test.
*/
const itIsAccessible = (...args) => {
  global.it('is accessible', () => {
    runAccessibilityTest(determineOptions.axeOptions(args));
  });
};

const methods = {
  itIsAccessible,
  validatesAccessibility,
  runAccessibilityTest,
};

export default methods;
