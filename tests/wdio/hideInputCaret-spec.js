describe('hideInputCaret', () => {
  before(() => {
    browser.url('/input.html');
  });

  it('validates the body\'s caret-color is transparent by default', () => {
    const element = browser.element('#textareaID');

    // wdio parses colors with rgb2hex so it becomes a rgba value
    // http://v4.webdriver.io/api/property/getCssProperty.html
    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('validates the textarea\'s caret-color is inherited as transparent', () => {
    const element = browser.element('#textareaID');

    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('validates the input\'s caret-color is inherited as transparent', () => {
    const element = browser.element('#inputID');

    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('sets the input\'s caret-color to orange', () => {
    browser.execute('document.querySelector("#inputID").style.caretColor = "rgb(255, 165, 0)"');
    const element = browser.element('#inputID');

    expect(element.getCssProperty('caretColor').value).to.equal('rgb(255,165,0)');
  });

  it('sets the input\'s caret-color back to transparent', () => {
    Terra.hideInputCaret('#inputID');
    const element = browser.element('#inputID');

    expect(element.getCssProperty('caretColor').value).to.equal('rgba(0,0,0,0)');
  });

  it('throws an error for a non-existent element', () => {
    expect(Terra.hideInputCaret.bind(this, '#NotAnElement')).to.throw('No element could be found');
  });
});
