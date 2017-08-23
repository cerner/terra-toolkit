const breakpointTag = browser => browser.currentTest.name.match(/\[@(.*?)\]/)[1];

const resize = (breakpoint, test) => (browser, done) => {
  const screenSize = browser.globals.breakpoints[breakpoint];

  if (!screenSize) {
    browser.end(done);
    throw new Error(`${breakpoint} is not defined`);
  }

  browser.url(browser.launchUrl);
  browser.resizeWindow(screenSize[0], screenSize[1], () => {
    test.apply(browser, [browser, done]);
  });
};

const resizeTo = (breakpoints, suite) => {
  const newTests = {};
  breakpoints.forEach((breakpoint) => {
    let firstStep = true;
    Object.keys(suite).reduce((tests, key) => {
      const resizedTests = {};
      const value = suite[key];
      if (typeof value === 'function') {
        if (firstStep) {
          resizedTests[`[@${breakpoint}] ${key}`] = resize(breakpoint, value);
          firstStep = false;
        } else {
          resizedTests[`[@${breakpoint}] ${key}`] = value;
        }
      } else {
        // Maintains Nightwatch Test Tags
        resizedTests[key] = value;
      }

      resizedTests.after = (browser, done) => {
        browser.end(done);
      };
      return Object.assign(tests, resizedTests);
    }, newTests);
  });
  return newTests;
};

module.exports.resizeTo = resizeTo;
module.exports.breakpointTag = breakpointTag;
