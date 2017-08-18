module.exports = {
  after: (browser, done) => {
    browser.end(done);
  },
  'Runs the test suite correctly statically': (browser) => {
    browser
      .url(browser.launchUrl)
      .assert.containsText('.test', 'Test');
  },
};
