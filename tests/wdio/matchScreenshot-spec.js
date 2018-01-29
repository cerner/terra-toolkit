/* global browser, describe,  before, Terra */
describe('matchScreenshot', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/compare.html'));

  Terra.should.matchScreenshot({ viewports });
  Terra.should.matchScreenshot('test-name-only');
  Terra.should.matchScreenshot('button', { selector: 'button', viewports });
  Terra.should.matchScreenshot('test-invalid-options', [viewports.tiny, viewports.huge]);
});
