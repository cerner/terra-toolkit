/**
 * Returns the current screen width.
 * @param {obj} browser - The current nightwatch session.
 */
const screenWidth = (browser) => {
  const breakpoint = browser.currentTest.name.match(/\[@(.*?)\]/)[1];
  return browser.globals.breakpoints[breakpoint][0];
};

/**
 * Resizes the browser.
 * @param {string} breakpoint - The breakpoint size to adjust the browser to.
 *      Accepts tiny, small, medium, large, huge, and enormous.
 * @param {obj} test - The test step to execute once sizing is complete.
 */
const resizeBrowser = (breakpoint, test) => (browser, done) => {
  const screenSize = browser.globals.breakpoints[breakpoint];

  if (!screenSize) {
    browser.end(done);
    throw new Error(`${breakpoint} is not defined`);
  }
  browser.url(browser.launchUrl);
  browser.resizeWindow(screenSize[0], screenSize[1]);
  test.apply(browser, [browser]);
};

/**
 * Duplicates the test steps in the suite and resizes the browser on the first step for each breakpoint provided.
 * @param {array of strings} breakpoints - The list of breakpoints to adjust the test suite to.
 *      Accepts tiny, small, medium, large, huge, and enormous.
 * @param {obj} suite - The nightwatch test suite to resize.
 */
const resizeTo = (breakpoints, suite) => {
  const breakpointTests = {};
  breakpoints.forEach((breakpoint) => {
    let firstStep = true;
    Object.keys(suite).reduce((testSteps, step) => {
      const resizedTests = {};
      const test = suite[step];
      if (typeof test === 'function') {
        if (firstStep) {
          resizedTests[`[@${breakpoint}] ${step}`] = resizeBrowser(breakpoint, test);
          firstStep = false;
        } else {
          resizedTests[`[@${breakpoint}] ${step}`] = test;
        }
      } else {
        // Maintain Nightwatch Test Tags
        resizedTests[step] = test;
      }
      return Object.assign(testSteps, resizedTests);
    }, breakpointTests);
  });
  return breakpointTests;
};

module.exports.resizeTo = resizeTo;
module.exports.screenWidth = screenWidth;
