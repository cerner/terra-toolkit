Terra.describeViewports('describeViewports', ['tiny', 'huge'], () => {
  it('creates tiny and huge screens', () => {
    browser.url('/compare.html');
    Terra.validates.screenshot();
  });

  it('expands the height', () => {
    const viewport = browser.getViewportSize();
    viewport.height = 1000;
    browser.setViewportSize(viewport);
    Terra.validates.screenshot('expands the height');
  });
});

Terra.describeViewports('describeViewports defaults', () => {
  it('creates only huge screens', () => {
    browser.url('/compare.html');
    Terra.validates.screenshot();
  });
});
