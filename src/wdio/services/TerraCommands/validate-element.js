import accessibilityMethods from './accessibility';
import visualRegressionMethods from './visual-regression';
import determineOptions from './determine-test-options';

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

const methods = {
  validatesElement,
  itValidatesElement,
};

export default methods;
