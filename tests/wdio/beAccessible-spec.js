const viewports = Terra.viewports('tiny', 'huge');

describe('beAccessible', () => {
  describe('accessible', () => {
    before(() => browser.url('/accessible.html'));
    Terra.it.isAccessible({ viewports });
  });

  describe('inaccessible contrast - test rules', () => {
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

    describe('inaccessible contrast - global rules', () => {
      const originalAxeConfig = browser.options.axe;
      before(() => {
        browser.options.axe = {
          ...browser.options.axe,
          options: {
            rules: [
              { id: 'color-contrast', enabled: false },
            ],
          },
        };
        browser.url('/inaccessible-contrast.html');
      });
      after(() => {
        browser.options.axe = originalAxeConfig;
      });

      it('is accessible', () => {
        Terra.validates.accessibility();
      });
    });

    describe('inaccessible contrast - Merged rules', () => {
      const originalAxeConfig = browser.options.axe;
      const ignoredA11y = {
        'image-alt': { enabled: false },
      };
      before(() => {
        browser.options.axe = {
          ...browser.options.axe,
          options: {
            rules: [
              { id: 'color-contrast', enabled: false },
            ],
          },
        };
        browser.url('/inaccessible-text.html');
      });
      after(() => {
        browser.options.axe = originalAxeConfig;
      });

      it('is accessible', () => {
        Terra.validates.accessibility({ rules: ignoredA11y });
      });
    });
  });
});
