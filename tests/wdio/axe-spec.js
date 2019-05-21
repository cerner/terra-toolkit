describe('axe', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  it('checks accessibility', () => {
    browser.url('/accessible.html');
    expect(browser.axe()).to.be.accessible();
  });

  it('checks inaccessibility', () => {
    browser.url('/inaccessible-contrast.html');
    expect(browser.axe({ viewports })).to.not.be.accessible();

    browser.url('/inaccessible-text.html');
    expect(browser.axe({ viewports })).to.not.be.accessible();
  });

  it('ignores inaccessibility based on rules', () => {
    browser.url('/inaccessible-contrast.html');
    const rules = {
      'color-contrast': { enabled: false },
    };
    expect(browser.axe({ viewports, rules })).to.be.accessible();
  });
});
