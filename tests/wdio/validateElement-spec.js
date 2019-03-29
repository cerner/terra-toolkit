describe('validateElement', () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
      browser.setViewportSize(Terra.viewports('tiny')[0]);
    });

    Terra.should.validateElement();
  });
});
