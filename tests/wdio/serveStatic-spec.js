describe('serveStatic', () => {
  describe('404 fallback', () => {
    before(() => browser.url('/derp'));
    Terra.it.matchesScreenshot();
  });
  describe('404 fallback with dash', () => {
    before(() => browser.url('/herp-derp'));
    Terra.it.matchesScreenshot();
  });
  describe('404 fallback js', () => {
    before(() => browser.url('/herp.js'));
    Terra.it.matchesScreenshot({ selector: 'body' });
  });
  describe('404 fallback html', () => {
    before(() => browser.url('/herp.html'));
    Terra.it.matchesScreenshot();
  });
  describe('404 fallback htm', () => {
    before(() => browser.url('/herp.htm'));
    Terra.it.matchesScreenshot();
  });
  describe('404 fallback nexted route', () => {
    before(() => browser.url('/derp/herp'));
    Terra.it.matchesScreenshot();
  });
});
