/* global browser, describe,  before, Terra */
describe('beComparable', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/compare.html'));

  Terra.should.beComparable({ viewports });
  Terra.should.beComparable({ name: 'button', css: 'button', viewports });
});
