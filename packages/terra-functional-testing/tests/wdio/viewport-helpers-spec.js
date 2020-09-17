Terra.describeViewports('Viewport Helpers', ['tiny', 'huge'], () => {
  it('creates tiny and huge screens', () => {
    browser.url('/compare.html');
    // Terra.validates.screenshot();
  });

  it('shrink the height', () => {
    const windowSize = browser.getWindowSize();
    const previousHeight = windowSize.height;
    windowSize.height = 100;
    browser.setWindowSize(windowSize.width, windowSize.height);

    const currentWindowSize = browser.getWindowSize();
    expect(currentWindowSize.height).not.toEqual(previousHeight);
    // Terra.validates.screenshot('expands the height');
  });

  it('viewport check', () => {
    const currentWindowSize = browser.getWindowSize();
    const largeViewport = Terra.viewports('large');

    expect(currentWindowSize.width).not.toEqual(largeViewport.width);
  });
});
