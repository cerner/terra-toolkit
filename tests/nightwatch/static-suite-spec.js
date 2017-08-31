module.exports = {
  'Runs the test suite correctly statically': (browser) => {
    browser
      .url(browser.launchUrl)
      .expect.element('.test').text.to.equal('Test');
  },
};
