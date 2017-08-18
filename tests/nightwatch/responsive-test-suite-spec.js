const { resizeTo, screenWidth } = require('../../lib/nightwatch/responsive-testing');

module.exports = resizeTo(['tiny', 'small', 'medium', 'large', 'huge', 'enormous'], {
  'Runs the test suite correctly when responsive': (browser) => {
    browser
      .url(browser.launchUrl)
      .assert.containsText('.test', 'Test');
  },
  'Adjusts the screen widths correctly': (browser) => {
    browser.url(browser.launchUrl);
    const width = screenWidth(browser);
    browser.windowSize('width', (result) => {
      // eslint-disable-next-line no-console
      console.log(`The test breakpoint width is: ${width} and the broswer width is ${result.value.width}`);
    });
  },
});
