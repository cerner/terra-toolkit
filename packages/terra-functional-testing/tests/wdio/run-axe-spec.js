/**
 * This spec is used for testing the global axe command.
 */

describe('Axe', () => {
  it('should successfully run axe on the page and report no violations', () => {
    browser.url('/accessible.html');

    const { result } = browser.axe();
    const { violations } = result;

    expect(violations.length).toEqual(0);
  });

  it('should report a color contrast violation', () => {
    browser.url('/insufficient-color-contrast.html');

    const { result } = browser.axe();
    const { violations } = result;

    expect(violations.length).toEqual(1);
    expect(violations[0].id).toEqual('color-contrast');
  });
});
