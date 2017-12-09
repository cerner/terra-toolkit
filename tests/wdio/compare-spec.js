/* global browser, describe, it, expect, before, Terra */
describe('comparing screenshots', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/compare.html'));

  it('[0] checks visual comparison with shortened id', () => {
    const screenshots = browser.checkElement('button', { viewports });
    expect(screenshots).to.matchReference();
  });

  it('checks visual comparison with a [tag]', () => {
    const screenshots = browser.checkElement('button', { viewports });
    expect(screenshots).to.matchReference();
  });

  it('checks visual comparison on document level', () => {
    const screenshots = browser.checkViewport({ viewports });
    expect(screenshots).to.matchReference();
  });
});
