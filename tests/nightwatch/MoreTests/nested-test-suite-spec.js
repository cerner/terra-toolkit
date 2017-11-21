const { resizeTo, screenWidth } = require('../../../lib/nightwatch/responsive-helpers');

module.exports = resizeTo(['tiny', 'small', 'medium', 'large', 'huge', 'enormous'], {
  'Runs the test suite correctly when responsive': (browser) => {
    browser
      .url(`${browser.launchUrl}/nightwatch.html`)
      .expect.element('.test').text.to.equal('Test');
  },

  'Adjusts the screen widths correctly': (browser) => {
    browser.url(`${browser.launchUrl}/nightwatch.html`);
    const testWidth = screenWidth(browser);

    browser.windowSize('width', (result) => {
      if (result.value.width !== testWidth) {
      // eslint-disable-next-line no-console
        throw new Error(`The test breakpoint width is: ${testWidth} and the browser width is ${result.value.width}`);
      }
    });
  },
});
