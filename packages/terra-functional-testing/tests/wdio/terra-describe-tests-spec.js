Terra.describeTests('Terra.describeTests', { formFactors: ['small', 'large'], locales: ['en', 'fr'], themes: ['terra-default-theme', 'orion-fusion-theme'] }, () => {
  it('should filter test by formFactors, locales, and themes', () => {
    browser.url('/accessible.html');
    Terra.validates.accessibility();
  });
});
