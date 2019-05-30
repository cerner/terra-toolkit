Terra.describeViewports('validateElement', ['tiny', 'small', 'huge'], () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
    });

    Terra.should.validateElement();
    Terra.it.validatesElement();
    it('validates element', () => {
      Terra.validates.element();
    });
  });

  describe('inaccessible contrast', () => {
    before(() => {
      browser.url('/inaccessible-contrast.html');
    });

    const ignoredA11y = {
      'color-contrast': { enabled: false },
    };

    Terra.it.validatesElement({ axeRules: ignoredA11y });

    it('checks element', () => {
      Terra.validates.element({ axeRules: ignoredA11y });
    });
  });
});
