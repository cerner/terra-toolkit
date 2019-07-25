describe('hideInputCaret', () => {
  before(() => {
    browser.url('/input.html');
    // The input explicitly has the caret-color set to black
    Terra.hideInputCaret('#inputID');
  });

  it('validates the input\'s caret-color is transparent', () => {
    const element = browser.element('#inputID');
    // wdio parses colors with rgb2hex so it becomes a rgba value
    // http://v4.webdriver.io/api/property/getCssProperty.html
    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('validates the textarea\'s caret-color is transparent', () => {
    const element = browser.element('#textareaID');
    // Terra service automatically sets caretColor on the body to transparent which gets inherited
    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('validates the body\'s caret-color is transparent', () => {
    const element = browser.element('#textareaID');
    // Terra service automatically sets caretColor on the body to transparent
    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('hides the input caret on a non-existent element', () => {
    expect(Terra.hideInputCaret.bind(this, '#NotAnElement')).to.throw('No element could be found');
  });
});
