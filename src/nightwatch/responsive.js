const resize = (breakpoint, test) => (browser, done) => {
  const size = browser.globals.breakpoints[breakpoint];

  if (!size) {
    throw new Error(`${breakpoint} is not defined`);
  }

  browser.resizeWindow(size[0], size[1], () => {
    test.apply(browser, [browser, done]);
  });
};

const resizeTo = (breakpoints, suite) =>
  Object.keys(suite).reduce((tests, key) => {
    const resizedTests = {};
    breakpoints.forEach((breakpoint) => {
      const value = suite[key];
      if (typeof value === 'function') {
        resizedTests[`${key} [@${breakpoint}]`] = resize(breakpoint, value);
      } else {
        // Test Tags
        resizedTests[key] = value;
      }
    });
    resizedTests.after = (browser, done) => {
      browser.end(done);
    };
    return Object.assign(resizedTests, tests);
  }, {});

module.exports.resizeTo = resizeTo;
