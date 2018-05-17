/* global browser, describe, it, before, expect */
describe('I18n Locale', () => {
  before(() => browser.url('/i18n.html'));

  it('Express correctly sets the application locale', () => {
    const browserLocale = browser.getAttribute('html', 'lang');
    const testLocale = browser.options.locale;
    expect(browserLocale).to.equal(testLocale);
  });
});
