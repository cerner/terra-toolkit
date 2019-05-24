describe('validateElement', () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
      browser.setViewportSize(Terra.viewports('tiny')[0]);
    });

    Terra.should.validateElement();
    Terra.it.validatesElement();

    it('checks element', () => {
      Terra.validates.element();
    });
  });

  describe('inaccessible contrast', () => {
    before(() => browser.url('/inaccessible-contrast.html'));

    const ignoredA11y = {
      'color-contrast': { enabled: false },
    };

    Terra.should.validateElement({ axeRules: ignoredA11y });
    Terra.it.validatesElement({ axeRules: ignoredA11y });

    it('checks element', () => {
      Terra.validates.element({ axeRules: ignoredA11y });
    });
  });
});
