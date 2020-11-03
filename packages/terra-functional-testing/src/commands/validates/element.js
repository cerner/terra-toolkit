/* eslint-disable no-unused-vars */
const accessibility = require('./accessibility');

/**
 * An assertion method to assert the page is accessible and the screenshot comparison result is within
 * the mismatch tolerance.
 *
 * This should be used within a Mocha `it` block.
 *
 * @param {Object} [options] - the test options
 * @param {string} [options.testName] - the test case name.
 * @param {Object} [options.rules] - the axe rules to use to assert accessibility.
 * @param {Number} [options.misMatchTolerance] - the mismatch tolerance for the screenshot comparison.
 * @param {string} [options.selector] - the element selector to use for the screenshot comparison.
 */
const element = (options = {}) => {
  const { rules, misMatchTolerance } = options;

  const selector = options.selector || global.Terra.serviceOptions.selector;
  const testName = options.testName || 'default';

  accessibility(rules);
  // TODO: Validate screen using visual regression
  // visualRegressionMethods.runMatchScreenshotTest(selector, { misMatchTolerance, testName });
};

module.exports = element;
