describe('axe', () => {
  const viewports = Terra.viewports('tiny', 'huge');
  const context = 'html';
  it('checks accessibility', () => {
    browser.url('/accessible.html');
    expect(browser.axe({ context })).to.be.accessible();
  });

  it('checks inaccessibility', () => {
    browser.url('/inaccessible-contrast.html');
    expect(browser.axe({ context, viewports })).to.not.be.accessible();

    browser.url('/inaccessible-text.html');
    expect(browser.axe({ context, viewports })).to.not.be.accessible();
  });

  it('ignores inaccessibility based on rules', () => {
    browser.url('/inaccessible-contrast.html');
    const rules = {
      'color-contrast': { enabled: false },
    };
    expect(browser.axe({ context, viewports, rules })).to.be.accessible();
  });

  it('runs only specified context', () => {
    browser.url('/inaccessible-contrast.html');
    expect(browser.axe({ viewports, context: 'h1' })).to.not.be.accessible();

    expect(browser.axe({ viewports, context: 'h2' })).to.be.accessible();
  });
});
