Terra.describeTests('Terra.describeTests', { formFactors: ['small', 'huge'], locales: ['en', 'fr'], themes: ['terra-default-theme', 'orion-fusion-theme'] }, () => {
  it('should filter test by formFactors, locales, and themes', async () => {
    await browser.url('/accessible.html');
    await Terra.validates.accessibility();
  });
});
