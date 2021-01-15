describe('Reduce Test Case: Terra + Test service -> 2 afterCommands-> 2 browser.executes', () => {
  it('executes both afterCommands with no issues', () => {
    browser.url('https://engineering.cerner.com/terra-application/tests/terra-application/application-base/private/test-overrides-test/');
    browser.refresh();
    // Terra.saveScreenshot();
    browser.saveScreenshot('ie-verification.png');
  });
});
