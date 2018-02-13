/* global browser, describe, it, before, after, expect, Terra */
describe('matchScreenshotExactly', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => {
    browser.url('/compare.html');
    browser.setViewportSize(viewports[0]);
  });

  describe('matchScreenshotExactly', () => {
    Terra.should.matchScreenshotExactly();
  });

  describe('matchScreenshotExactly-test name', () => {
    Terra.should.matchScreenshotExactly('test-name-only');
  });

  describe('matchScreenshotExactly-options--viewports', () => {
    after(() => browser.setViewportSize(viewports[0]));

    Terra.should.matchScreenshotExactly({ viewports });
  });

  describe('matchScreenshotExactly-options--selector', () => {
    Terra.should.matchScreenshotExactly({ selector: 'button' });
  });

  describe('matchScreenshotExactly-options--misMatchTolerance', () => {
    after(() => {
      browser.refresh();
    });

    // Base screenshots
    Terra.should.matchScreenshotExactly();

    it('adjusts image:', () => {
      browser.execute('document.getElementsByClassName("test")[0].style.color = "blue";');
    });

    // Manually verify failure when providng misMatchTolerance. Create same screenshots as the base screenshots
    it('default', () => {
      // create default screenshot selector
      const selector = browser.options.terra.selector;

      // create default screenshot options
      const compareOptions = {};
      compareOptions.viewports = [];
      compareOptions.misMatchTolerance = { misMatchTolerance: 5 };
      compareOptions.viewportChangePause = browser.options.visualRegression.viewportChangePause;

      const screenshots = browser.checkElement(selector, compareOptions);
      expect(screenshots).to.not.matchReference('exactly');
    });
  });

  describe('matchScreenshotExactly-options--viewportChangePause', () => {
    let startTime;
    before(() => {
      startTime = new Date().getTime();
    });

    Terra.should.matchScreenshotExactly({ viewports, viewportChangePause: 500 });

    it('waited as expected', () => {
      const endTime = new Date().getTime();
      const totalTime = endTime - startTime;
      expect(totalTime).to.be.above(500);
    });
  });

  describe('matchScreenshotExactly-test name & options', () => {
    after(() => browser.setViewportSize(viewports[0]));

    Terra.should.matchScreenshotExactly('button', { selector: 'button', viewports });
  });

  describe('matchScreenshotExactly-invalid options', () => {
    Terra.should.matchScreenshotExactly('test-invalid-options', [viewports.tiny, viewports.huge]);
  });
});
