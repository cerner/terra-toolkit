import accessibilityMethods from './accessiblity';
import visualRegressionMethods from './visual-regression';
import testOptions from './test-options';

/**
 * Mocha-chai wrapper method to capture screenshots of a specified element and assert the
 * screenshot comparision results are within the mismatch tolerance.
 * @param  {Array} args The list of test arguments to parse. Accepted Arguments:
 *    - String (optional): the test case name. Default name is 'default'
 *    - Object (optional): the test options. Options include selector, misMatchTolerance,
 *        and axeRules
 */
const validateElement = (...args) => {
  const axeOptions = testOptions.determineAxeOptions(args);
  const {
    name,
    selector,
    misMatchTolerance,
  } = testOptions.determineScreenshotOptions(args);

  accessibilityMethods.beAccessible(axeOptions);
  visualRegressionMethods.screenshotItBlock(name, selector, { misMatchTolerance });
};

export default validateElement;
