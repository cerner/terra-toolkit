Terra.describeViewports('defaultViewports - opinionated test', ['tiny', 'large'], () => {
  it('viewport check', () => {
    const currentViewport = browser.getViewportSize();
    const hugeViewport = Terra.viewports('huge')[0];

    expect(currentViewport.width).to.not.equal(hugeViewport.width);
  });
});

describe('defaultViewport - unopinionated test', () => {
  it('viewport check', () => {
    const currentViewport = browser.getViewportSize();
    const hugeViewport = Terra.viewports('huge')[0];

    expect(currentViewport.width).to.equal(hugeViewport.width);
    expect(currentViewport.height).to.equal(hugeViewport.height);
  });
});
