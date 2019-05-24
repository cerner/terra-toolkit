import determineOptions from './determine-test-options';

/**
 * The run axe to validate no accessibility violations were found.
 * @param {Object} options - The Axe options. Available options are viewports and
 * rules.
 */
const runAccessibilityTest = (options) => {
  const axeResults = global.browser.axe(options);
  global.expect(axeResults).to.be.accessible();
};

/**
* A mocha-chai convenience test case to assert accessibility.
* @param {Object} options - The Axe options. Available options are viewports,
* rules, and context. See https://www.axe-core.org/docs/.
*/
const validatesAccessibility = (...args) => {
  runAccessibilityTest(determineOptions.axeOptions(args));
};

/**
* A mocha-chai convenience test case to assert accessibility.
* @param {Object} options - The Axe options. Available options are viewports,
* rules, and context. See https://www.axe-core.org/docs/.
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
