/* global browser, describe, it, expect, Terra */
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

  it('runs only specified tags', () => {
    browser.url('/inaccessible-text.html');
    const runOnly = {
      type: 'tag',
      values: ['color-contrast'],
    };
    expect(browser.axe({ viewports, runOnly })).to.be.accessible();
  });

  it('runs only specified context', () => {
    browser.url('/inaccessible-contrast.html');
    let context = 'h1';
    expect(browser.axe({ viewports, context })).to.not.be.accessible();

    context = 'h2';
    expect(browser.axe({ viewports, context })).to.be.accessible();
  });
});
