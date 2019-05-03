describe('matchScreenshot', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => {
    browser.url('/compare.html');
    browser.setViewportSize(viewports[0]);
  });

  describe('matchScreenshot', () => {
    Terra.should.matchScreenshot();
  });

  describe('matchScreenshot-test name', () => {
    Terra.should.matchScreenshot('test-name-only');
  });

  describe('matchScreenshot-options--viewports', () => {
    after(() => browser.setViewportSize(viewports[0]));

    Terra.should.matchScreenshot({ viewports });
  });

  describe('matchScreenshot-options--selector', () => {
    Terra.should.matchScreenshot({ selector: 'button' });
  });

  describe('matchScreenshot-options--misMatchTolerance', () => {
    after(() => {
      browser.refresh();
    });

    // Base screenshots
    Terra.should.matchScreenshot();

    it('adjusts image:', () => {
      browser.execute('document.getElementsByClassName("test")[0].style.color = "blue";');
    });

    Terra.should.matchScreenshot({ misMatchTolerance: 100 });

    // Manually verify failure. Create same screenshots as the base screenshots
    it('default', () => {
      // create default screenshot selector
      const { selector } = browser.options.terra;

      // create default screenshot options
      const compareOptions = {};
      compareOptions.viewports = [];
      compareOptions.misMatchTolerance = browser.options.visualRegression.compare.misMatchTolerance;
      compareOptions.viewportChangePause = browser.options.visualRegression.viewportChangePause;

      const screenshots = browser.checkElement(selector, compareOptions);
      expect(screenshots).to.not.matchReference();
    });
  });

  describe('matchScreenshot-test name & options', () => {
    after(() => browser.setViewportSize(viewports[0]));

    Terra.should.matchScreenshot('button', { selector: 'button', viewports });
  });

  describe('matchScreenshot-invalid options', () => {
    Terra.should.matchScreenshot('test-invalid-options', [viewports.tiny, viewports.huge]);
  });
});
