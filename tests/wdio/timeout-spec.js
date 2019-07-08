Terra.describeViewports('timeout', ['tiny'], () => {
  it('times out without throwing an error', () => {
    browser.url('/timeout.html');
    Terra.validates.screenshot('url');
    browser.url();
    Terra.validates.screenshot('url-no-param');
    browser.refresh();
    Terra.validates.screenshot('refresh');
    browser.url('/timeout.html').refresh();
    Terra.validates.screenshot('chain');
  });
});
