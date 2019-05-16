describe('validateElement', () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
      browser.setViewportSize(Terra.viewports('tiny')[0]);
    });

    Terra.should.validateElement();
  });

  describe('inaccessible contrast', () => {
    before(() => browser.url('/inaccessible-contrast.html'));

    const ignoredA11y = {
      'color-contrast': { enabled: false },
    };

    Terra.should.validateElement({ axeRules: ignoredA11y });
  });
});
