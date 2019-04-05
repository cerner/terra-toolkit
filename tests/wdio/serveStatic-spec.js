describe('serveStatic', () => {
  describe('404 fallback', () => {
    before(() => browser.url('/derp'));
    Terra.should.matchScreenshot();
  });
  describe('404 fallback with dash', () => {
    before(() => browser.url('/herp-derp'));
    Terra.should.matchScreenshot();
  });
  describe('404 fallback js', () => {
    before(() => browser.url('/herp.js'));
    Terra.should.matchScreenshot({ selector: 'body' });
  });
  describe('404 fallback html', () => {
    before(() => browser.url('/herp.html'));
    Terra.should.matchScreenshot();
  });
  describe('404 fallback htm', () => {
    before(() => browser.url('/herp.htm'));
    Terra.should.matchScreenshot();
  });
  describe('404 fallback nexted route', () => {
    before(() => browser.url('/derp/herp'));
    Terra.should.matchScreenshot();
  });
});
