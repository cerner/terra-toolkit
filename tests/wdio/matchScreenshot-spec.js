describe('matchScreenshot', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => {
    browser.url('/compare.html');
    browser.setViewportSize(viewports[0]);
  });

  describe('matchScreenshot', () => {
    Terra.should.matchScreenshot();
    Terra.it.matchesScreenshot();

    it('checks default screenshot', () => {
      Terra.validates.screenshot();
    });
  });

  describe('matchScreenshot-test name', () => {
    Terra.should.matchScreenshot('test-name-only');
    Terra.it.matchesScreenshot('test-name-only');

    it('checks [default] screenshot', () => {
      Terra.validates.screenshot('test-name-only');
    });
  });

  describe('matchScreenshot-options--viewports', () => {
    after(() => browser.setViewportSize(viewports[0]));

    Terra.should.matchScreenshot('test-name-only');
    Terra.it.matchesScreenshot({ viewports });

    it('matches screenshot', () => {
      Terra.validates.screenshot({ viewports });
    });
  });

  describe('matchScreenshot-options--selector', () => {
    Terra.should.matchScreenshot('test-name-only');
    Terra.it.matchesScreenshot({ selector: '#content' });

    it('matches screenshot', () => {
      Terra.validates.screenshot({ selector: '#content' });
    });
  });

  describe('matchScreenshot-options--misMatchTolerance', () => {
    after(() => {
      browser.refresh();
    });

    // Base screenshots
    Terra.should.matchScreenshot();
    Terra.it.matchesScreenshot();

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });

    it('adjusts image:', () => {
      browser.execute('document.getElementsByClassName("test")[0].style.color = "blue";');
    });

    Terra.should.matchScreenshot({ misMatchTolerance: 100 });
    Terra.it.matchesScreenshot({ misMatchTolerance: 100 });

    it('matches screenshot', () => {
      Terra.validates.screenshot({ misMatchTolerance: 100 });
    });

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

    Terra.should.matchScreenshot('button', { selector: '#content', viewports });
    Terra.it.matchesScreenshot('button', { selector: '#content', viewports });
  });

  describe('matchScreenshot-invalid options', () => {
    Terra.should.matchScreenshot('test-invalid-options', [viewports.tiny, viewports.huge]);
    Terra.it.matchesScreenshot('test-invalid-options', [viewports.tiny, viewports.huge]);
  });
});
