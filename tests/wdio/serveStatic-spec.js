describe('serveStatic', () => {
  describe('404 fallback', () => {
    before(() => browser.url('/derp'));
    Terra.should.matchScreenshot();
  });
});
