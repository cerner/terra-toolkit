const accessibility = require('./accessibility');

/**
 * An assertion method to assert the page is accessible and the screenshot comparison result is within
 * the mismatch tolerance.
 *
 * This should be used within a Mocha `it` block.
 * @param {string} [testName] - the test case name.
 * @param {Object} [options] - the test options
 * @param {Object} [options.rules] - the axe rules to use to assert accessibility.
 * @param {Number} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector] - the element selector to use for the screenshot comparison.
 */
const element = (testName, options = {}) => {
  if (!testName || typeof testName !== 'string' || testName.length === 0) {
    throw new Error('[terra-functional-testing:wdio] Terra.validates.element requires a test name as the first argument.');
  }

  const { rules } = options;

  accessibility({ rules });

  // TODO: Validate screen using visual regression
  // const { misMatchTolerance } = options;
  // const selector = options.selector || global.Terra.serviceOptions.selector;
  // visualRegressionMethods.runMatchScreenshotTest(selector, { misMatchTolerance, testName });
};

module.exports = element;
