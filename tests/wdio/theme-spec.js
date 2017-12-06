/* global browser, describe, beforeEach, Terra */
describe('themeEachCustomProperty', () => {
  beforeEach(() => browser.url('/theme.html'));

  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '50px',
  });
});
