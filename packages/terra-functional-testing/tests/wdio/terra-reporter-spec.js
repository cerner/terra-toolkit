describe('Axe 1 ', () => {
  describe('Axe 2', () => {
    it('should report no accessibility violations', () => {
      browser.url('/accessible.html');

      Terra.validates.accessibility();
    });

    it('should report no accessibility violations', () => {
      browser.url('/insufficient-color-contrast.html');

      Terra.validates.accessibility();
    });
  });
});
