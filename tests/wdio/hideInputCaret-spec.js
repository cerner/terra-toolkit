describe('hideInputCaret', () => {
  before(() => {
    browser.url('/input.html');
    Terra.hideInputCaret('#inputID');
  });

  it('validates the caretColor is transparent', () => {
    const element = browser.element('#inputID');
    // wdio parses colors with rgb2hex so it becomes a rgba value
    // http://v4.webdriver.io/api/property/getCssProperty.html
    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });
});
