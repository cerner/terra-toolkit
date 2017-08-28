'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Returns the current screen width.
 * @param {obj} browser - The current nightwatch session.
 */
var screenWidth = function screenWidth(browser) {
  var breakpoint = browser.currentTest.name.match(/\[@(.*?)\]/)[1];
  return browser.globals.breakpoints[breakpoint][0];
};

/**
 * Resizes the browser.
 * @param {string} breakpoint - The breakpoint size to adjust the browser to.
 *      Accepts tiny, small, medium, large, huge, and enormous.
 * @param {obj} test - The test step to execute once sizing is complete.
 */
var resizeBrowser = function resizeBrowser(breakpoint, test) {
  return function (browser, done) {
    var screenSize = browser.globals.breakpoints[breakpoint];

    if (!screenSize) {
      browser.end(done);
      throw new Error(breakpoint + ' is not defined');
    }
    browser.url(browser.launchUrl);
    browser.resizeWindow(screenSize[0], screenSize[1]);
    test.apply(browser, [browser]);
  };
};

/**
 * Duplicates the test steps in the suite and resizes the browser on the first step for each breakpoint provided.
 * @param {array of strings} breakpoints - The list of breakpoints to adjust the test suite to.
 *      Accepts tiny, small, medium, large, huge, and enormous.
 * @param {obj} suite - The nightwatch test suite to resize.
 */
var resizeTo = function resizeTo(breakpoints, suite) {
  var breakpointTests = {};
  breakpoints.forEach(function (breakpoint) {
    var firstStep = true;
    Object.keys(suite).reduce(function (testSteps, step) {
      var resizedTests = {};
      var test = suite[step];
      if (typeof test === 'function') {
        if (firstStep) {
          resizedTests['[@' + breakpoint + '] ' + step] = resizeBrowser(breakpoint, test);
          firstStep = false;
        } else {
          resizedTests['[@' + breakpoint + '] ' + step] = test;
        }
      } else {
        // Maintain Nightwatch Test Tags
        resizedTests[step] = test;
      }
      return _extends(testSteps, resizedTests);
    }, breakpointTests);
  });
  return breakpointTests;
};

module.exports.resizeTo = resizeTo;
module.exports.screenWidth = screenWidth;