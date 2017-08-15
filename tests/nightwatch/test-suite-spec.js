/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const resizeTo = require('../../src/nightwatch/responsive').resizeTo;

module.exports = resizeTo(['small', 'tiny', 'medium', 'large', 'huge', 'enormous'], {
  'Runs the test suite correctly': (browser) => {
    browser
      .url(browser.launchUrl)
      .assert.containsText('.test', 'Test');
  },
});
