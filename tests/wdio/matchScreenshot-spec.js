/* global browser, describe,  before, Terra */
describe('matchScreenshot', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/compare.html'));

  Terra.should.matchScreenshot({ viewports });
  Terra.should.matchScreenshot('button', { selector: 'button', viewports });
});
