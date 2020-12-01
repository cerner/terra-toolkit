/**
 * This spec file is used for integration testing the Terra.validates commands.
 */

Terra.describeViewports('Terra.validates.accessibility', ['small', 'large'], () => {
  it('should report no accessibility violations', () => {
    browser.url('/accessible.html');

    Terra.validates.accessibility();
  });

  it('should report an accessibility violation', () => {
    browser.url('/insufficient-color-contrast.html');

    let caughtError;

    try {
      Terra.validates.accessibility();
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError.message).toEqual(expect.stringContaining('expected no accessibility violations but received'));
  });

  it('should report no accessibility violations when a rule override is provided', () => {
    browser.url('/insufficient-color-contrast.html');

    Terra.validates.accessibility({ rules: { 'color-contrast': { enabled: false } } });
  });
});
