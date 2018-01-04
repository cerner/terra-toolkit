/* global browser, describe, before, Terra */
describe('axe', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  describe('accessible', () => {
    const ignoredA11y = {
      'landmark-one-main': { enabled: false },
    };

    before(() => browser.url('/accessible.html'));
    Terra.should.beAccessible({ viewports, rules: ignoredA11y });
  });

  describe('inaccessible contrast', () => {
    const ignoredA11y = {
      'color-contrast': { enabled: false },
      'landmark-one-main': { enabled: false },
    };

    before(() => browser.url('/inaccessible-contrast.html'));
    Terra.should.beAccessible({ viewports, rules: ignoredA11y });
  });
});
