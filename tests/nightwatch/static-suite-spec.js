const snapshot = require('../../src/nightwatch/snapshot');

module.exports = {
  'Runs the test suite correctly statically': (browser) => {
    browser
      .url(browser.launchUrl)
      .perform(snapshot);
  },
};
