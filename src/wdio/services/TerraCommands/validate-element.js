import accessibilityMethods from './accessiblity';
import visualRegressionMethods from './visual-regression';

/**
* Helper method to determine the test name name, the element selector, the mismatch tolerance, and the axe rules
* @param {Array} args - The list of test arguments to parse.
*/
const determineOptions = (...args) => {
  const param1 = args.length ? args[0] : undefined;
  const param2 = args.length > 1 ? args[1] : undefined;

  let name = 'default';
  let options = {};
  if (typeof param1 === 'string') {
    name = param1;
    options = typeof param2 === 'object' && !Array.isArray(param2) ? param2 : options;
  } else {
    options = typeof param1 === 'object' && !Array.isArray(param1) ? param1 : options;
  }

  // Check if custom selector should be used, otherwise use the global value.
  const selector = options.selector || global.browser.options.terra.selector;

  // Check if custom misMatchTolerance should be used, otherwise use the global value.
  const misMatchTolerance = options.misMatchTolerance || global.browser.options.visualRegression.compare.misMatchTolerance;

  return {
    name,
    selector,
    misMatchTolerance,
    axeOptions: {
      ...options.axeRules && { rules: options.axeRules },
      restoreScroll: true,
      context: selector,
    },
  };
};

/**
 * A chai assertion method to assert the page is accessible and the screenshot comparison result is within
 * the mismatch tolerance.
 *
 * This should be used within a Mocha `it` block.
 *
 * @param {string} [name=default] - the test case name.
 * @param {Object} [options] - the test options
 * @param {Object} [options.axeRules] - the axe rules to use to assert accessibility.
 * @param {Number} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for the
 *    screenshot comparison.
 */
const validatesElement = (...args) => {
  const {
    name,
    selector,
    misMatchTolerance,
    axeOptions,
  } = determineOptions(...args);

  accessibilityMethods.runAccessibilityTest(axeOptions);
  visualRegressionMethods.runMatchScreenshotTest('withinTolerance', selector, { misMatchTolerance, name });
};

/**
 * Mocha `it` block to assert the page is accessible and the screenshot comparison result is within the
 * mismatch tolerance.
 *
 * @param {string} [name=default] - the test case name.
 * @param {Object} [options] - the test options
 * @param {Object} [options.axeRules] - the axe rules to use to assert accessibility.
 * @param {Number} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector=browser.options.terra.selector] - the element selector to use for the screenshot comparison.
 */
const itValidatesElement = (...args) => {
  const {
    name,
    selector,
    misMatchTolerance,
    axeOptions,
  } = determineOptions(...args);

  global.it(`[${name}] is accessible and is within the mismatch tolerance`, () => {
    accessibilityMethods.runAccessibilityTest(axeOptions);
    visualRegressionMethods.runMatchScreenshotTest('withinTolerance', selector, { misMatchTolerance });
  });
};

const methods = {
  validatesElement,
  itValidatesElement,
};

export default methods;
