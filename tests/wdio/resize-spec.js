/* global browser, describe, it, expect, before, Terra */
describe('resize utility', () => {
  before(() => browser.url('/compare.html'));

  it('resizes to tiny and huge', () => {
    Terra.resize('tiny', 'huge', (name, viewport) => {
      const size = browser.getViewportSize();
      expect(size.height).to.equal(viewport.height);
      expect(size.width).to.equal(viewport.width);
    });
  });

  it('resizes to a single viewport', () => {
    Terra.resize('tiny', (name, viewport) => {
      const size = browser.getViewportSize();
      expect(size.height).to.equal(viewport.height);
      expect(size.width).to.equal(viewport.width);
      expect(name).to.equal('tiny');
    });
  });
});
