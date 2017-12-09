/* global browser, describe, before, Terra */
describe('axe', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  describe('accessible', () => {
    before(() => browser.url('/accessible.html'));
    Terra.should.beAccessible({ viewports });
  });

  describe('inaccessible contrast', () => {
    const ignoreContrast = {
      'color-contrast': { enabled: false },
    };

    before(() => browser.url('/inaccessible-contrast.html'));
    Terra.should.beAccessible({ viewports, rules: ignoreContrast });
  });
});
