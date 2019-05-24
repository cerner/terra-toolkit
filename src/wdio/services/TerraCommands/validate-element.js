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
const itValidatesElement = (...args) => {
  const {
    rules,
  } = determineOptions.axeOptions(args);

  const {
    name,
    selector,
    misMatchTolerance,
  } = determineOptions.screenshotOptions(args);

  global.it(`[${name}] is accessible and is within the mismatch tolerance`, () => {
    accessibilityMethods.runAccessibilityTest({ rules });
    visualRegressionMethods.runMatchScreenshotTest(selector, { misMatchTolerance, name });
  });
};

const validatesElement = (...args) => {
  const {
    rules,
  } = determineOptions.axeOptions(args);

  const {
    name,
    selector,
    misMatchTolerance,
  } = determineOptions.screenshotOptions(args);

  accessibilityMethods.runAccessibilityTest({ rules });
  visualRegressionMethods.runMatchScreenshotTest(selector, { misMatchTolerance, name });
};

const methods = {
  validatesElement,
  itValidatesElement,
};

export default methods;
