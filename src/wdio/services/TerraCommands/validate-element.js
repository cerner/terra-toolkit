import accessibilityMethods from './accessibility';
import visualRegressionMethods from './visual-regression';
import determineOptions from './determine-test-options';

/**
 * Mocha-chai wrapper method to capture screenshots of a specified element and assert the
 * screenshot comparison results are within the mismatch tolerance.
 * @param  {Array} args The list of test arguments to parse. Accepted Arguments:
 *    - String (optional): the test case name. Default name is 'default'
 *    - Object (optional): the test options. Options include selector, misMatchTolerance,
 *        and axeRules
 */
const validateElement = (...args) => {
  const {
    rules,
  } = determineOptions.axeOptions(args);

  const {
    name,
    selector,
    misMatchTolerance,
  } = determineOptions.screenshotOptions(args);

  accessibilityMethods.accessibleItBlock({ rules });
  visualRegressionMethods.screenshotItBlock(name, selector, { misMatchTolerance });
};

export default validateElement;
