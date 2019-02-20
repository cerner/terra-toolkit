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
    axeOptions: { ...options.axeRules, context: selector },
  };
};

/**
 * Mocha-chai wrapper method to capture screenshots of a specified element and assert the
 * screenshot comparision results are within the mismatch tolerance.
 * @param  {Array} args The list of test arguments to parse. Accepted Arguments:
 *    - String (optional): the test case name. Default name is 'default'
 *    - Object (optional): the test options. Options include selector, misMatchTolerance,
 *        and axeRules
 */
const validateElement = (...args) => {
  const {
    name,
    selector,
    misMatchTolerance,
    axeOptions,
  } = determineOptions(...args);

  accessibilityMethods.beAccessible(axeOptions);
  visualRegressionMethods.screenshotItBlock(name, 'withinTolerance', selector, { misMatchTolerance });
};

export default validateElement;
