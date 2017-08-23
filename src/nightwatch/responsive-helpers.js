// const screenWidth = (browser) => {
//   const breakpoint = browser.currentTest.name.match(/\[@(.*?)\]/)[1];
//   return browser.globals.breakpoints[breakpoint][0];
// };
//
// const resize = breakpoint => (browser, done) => {
//   const screenSize = browser.globals.breakpoints[breakpoint];
//
//   if (!screenSize) {
//     browser.end(done);
//     throw new Error(`${breakpoint} is not defined`);
//   }
//
//   browser.url(browser.launchUrl);
//   browser.resizeWindow(screenSize[0], screenSize[1], done);
// };
//
// const resizeTo = (breakpoints, suite) => {
//   const newTests = {};
//   breakpoints.forEach((breakpoint) => {
//     newTests[`Adjust Broswer to [@${breakpoint}]`] = () => resize(breakpoint);
//     Object.keys(suite).reduce((tests, key) => {
//       const resizedTests = {};
//       const value = suite[key];
//       if (typeof value === 'function') {
//         resizedTests[`${key} [@${breakpoint}]`] = value;
//       } else {
//         // Maintains Nightwatch Test Tags
//         resizedTests[key] = value;
//       }
//
//       resizedTests.after = (browser, done) => {
//         browser.end(done);
//       };
//       return Object.assign(tests, resizedTests);
//     }, newTests);
//   });
//   return newTests;
// };
//
// module.exports.resizeTo = resizeTo;
// module.exports.screenWidth = screenWidth;

const screenWidth = (browser) => {
  const breakpoint = browser.currentTest.name.match(/\[@(.*?)\]/)[1];
  return browser.globals.breakpoints[breakpoint][0];
};

const resize = (breakpoint, test) => (browser, done) => {
  const screenSize = browser.globals.breakpoints[breakpoint];

  if (!screenSize) {
    browser.end(done);
    throw new Error(`${breakpoint} is not defined`);
  }

  browser.url(browser.launchUrl);
  browser.resizeWindow(screenSize[0], screenSize[1], () => {
    console.log('resized!');
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
        // Maintains Nightwatch Test Tags
        resizedTests[key] = value;
      }
    });
    resizedTests.after = (browser, done) => {
      browser.end(done);
    };
    return Object.assign(tests, resizedTests);
  }, {});

module.exports.resizeTo = resizeTo;
module.exports.screenWidth = screenWidth;
