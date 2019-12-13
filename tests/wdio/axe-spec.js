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

  it('ignores inaccessibility based on test rules', () => {
    browser.url('/inaccessible-text.html');
    const rules = {
      'color-contrast': { enabled: false },
      'image-alt': { enabled: false },
    };
    expect(browser.axe({ viewports, rules })).to.be.accessible();
  });

  it('ignores inaccessibility based on global rules', () => {
    const originalAxeConfig = browser.options.axe.options || {};
    browser.options.axe.options = {
      rules: [
        { id: 'color-contrast', enabled: false },
        { id: 'image-alt', enabled: false },
      ],
    };
    browser.url('/inaccessible-text.html');
    expect(browser.axe()).to.be.accessible();
    browser.options.axe.options = originalAxeConfig;
  });

  it('ignores inaccessibility based on merged rules', () => {
    const originalAxeConfig = browser.options.axe.options || {};
    const rules = {
      'image-alt': { enabled: false },
    };

    browser.options.axe.options = {
      rules: [
        { id: 'color-contrast', enabled: false },
      ],
    };
    browser.url('/inaccessible-text.html');

    expect(browser.axe({ rules })).to.be.accessible();
    browser.options.axe.options = originalAxeConfig;
  });
});
