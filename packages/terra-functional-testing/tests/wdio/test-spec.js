describe('Reduce Test Case: Terra + Test service -> 2 afterCommands-> 2 browser.executes', () => {
  it('executes both afterCommands with no issues', () => {
    browser.url('/dispatch-custom-event.html');
    browser.refresh();
  });
});
