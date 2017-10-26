/* global browser, describe, it, expect, viewport */
describe('compare', () => {
  const viewports = viewport('tiny', 'huge');
  it('checks visual comparison', () => {
    browser.url('/compare.html');
    const screenshots = browser.checkElement('button', { viewports });
    expect(screenshots).to.matchReference();
  });
});
