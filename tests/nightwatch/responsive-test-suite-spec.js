const { resizeTo, breakpointTag } = require('../../lib/nightwatch/responsive-helpers');

module.exports = resizeTo(['tiny', 'small', 'medium', 'large', 'huge', 'enormous'], {
  'Runs the test suite correctly when responsive': (browser) => {
    browser
      .url(browser.launchUrl)
      .assert.containsText('.test', 'Test');
  },
  'Adjusts the screen widths correctly': (browser) => {
    browser.url(browser.launchUrl);
    const breakpoint = breakpointTag(browser);
    const testWidth = browser.globals.breakpoints[breakpoint][0];

    browser.windowSize('width', (result) => {
      if (result.value.width !== testWidth) {
      // eslint-disable-next-line no-console
        throw new Error(`The test breakpoint width is: ${testWidth} and the broswer width is ${result.value.width}`);
      }
    });
  },
});
