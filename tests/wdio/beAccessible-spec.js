describe('be accessible', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  describe('accessible', () => {
    before(() => browser.url('/accessible.html'));
    Terra.should.beAccessible({ viewports });
    Terra.it.isAccessible({ viewports });
    it('is accessible', () => {
      Terra.validates.accessibility({ viewports });
    })
  });

  describe('inaccessible contrast', () => {
    const ignoredA11y = {
      'color-contrast': { enabled: false },
    };

    before(() => browser.url('/inaccessible-contrast.html'));
    Terra.should.beAccessible({ viewports, rules: ignoredA11y });
    Terra.it.isAccessible({ viewports, rules: ignoredA11y });
    it('is accessible', () => {
      Terra.validates.accessibility({ viewports, rules: ignoredA11y });
    })
  });
});
