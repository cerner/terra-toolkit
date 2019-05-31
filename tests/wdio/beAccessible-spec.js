const viewports = Terra.viewports('tiny', 'huge');

describe('beAccessible', () => {
  describe('accessible', () => {
    before(() => browser.url('/accessible.html'));
    Terra.it.isAccessible({ viewports });
  });

  describe('inaccessible contrast', () => {
    const ignoredA11y = {
      'color-contrast': { enabled: false },
    };

    before(() => browser.url('/inaccessible-contrast.html'));
    Terra.it.isAccessible({ viewports, rules: ignoredA11y });
  });
});

viewports.forEach((viewport) => {
  describe('beAccessible with looping', () => {
    before(() => browser.setViewportSize(viewport));

    describe('accessible', () => {
      before(() => browser.url('/accessible.html'));
      it('is accessible', () => {
        Terra.validates.accessibility();
      });
    });

    describe('inaccessible contrast', () => {
      const ignoredA11y = {
        'color-contrast': { enabled: false },
      };
      before(() => browser.url('/inaccessible-contrast.html'));

      it('is accessible', () => {
        Terra.validates.accessibility({ rules: ignoredA11y });
      });
    });
  });
});
