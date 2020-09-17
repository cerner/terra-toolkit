Terra.describeViewports('Viewport Helpers', ['tiny', 'huge'], () => {
  it('creates tiny and huge screens', () => {
    browser.url('/compare.html');
    // Terra.validates.screenshot();
  });

  it('expands the height', () => {
    const windowSize = browser.getWindowSize();
    const previousHeight = windowSize.height;
    windowSize.height = 1000;
    browser.setWindowSize(windowSize.width, windowSize.height);

    const currentWindowSize = browser.getWindowSize();
    expect(currentWindowSize.height).to.not.equal(previousHeight);
    // Terra.validates.screenshot('expands the height');
  });

  it('viewport check', () => {
    const currentWindowSize = browser.getWindowSize();
    const largeViewport = Terra.viewports('large')[0];

    expect(currentWindowSize.width).to.not.equal(largeViewport.width);
  });
});
