/* global browser, describe, it, expect, viewport */
describe('compare', () => {
  const viewports = viewport('tiny', 'huge');
  it('[0] checks visual comparison with shortened id', () => {
    browser.url('/compare.html');
    const screenshots = browser.checkElement('button', { viewports });
    expect(screenshots).to.matchReference();
  });

  it('checks visual comparison on document level.', () => {
    browser.url('/compare.html');
    const screenshots = browser.checkViewport({ viewports });
    expect(screenshots).to.matchReference();
  });
});
