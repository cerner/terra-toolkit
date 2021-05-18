/**
 * This spec file is used for integration testing the Terra.validates commands.
 */
Terra.describeViewports('Terra.validates', ['small', 'large'], () => {
  describe('accessibility', () => {
    it('should report no accessibility violations', () => {
      browser.url('/accessible.html');

      Terra.validates.accessibility();
    });

    it('should report an accessibility violation', () => {
      browser.url('/insufficient-color-contrast.html');

      let caughtError;

      try {
        Terra.validates.accessibility();
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError.message).toEqual(expect.stringContaining('expected no accessibility violations but received'));
    });

    it('should report no accessibility violations when a rule override is provided', () => {
      browser.url('/insufficient-color-contrast.html');

      Terra.validates.accessibility({ rules: { 'color-contrast': { enabled: false } } });
    });
  });

  describe('screenshot', () => {
    it('should validate screenshot without performing accessibility check', () => {
      browser.url('/insufficient-color-contrast.html');

      Terra.validates.screenshot('validates-screenshot');
    });

    it('should require a screenshot name', () => {
      const errorMessage = '[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.';

      expect(() => Terra.validates.screenshot()).toThrow(errorMessage);
    });

    it('should fail with invalid selector', () => {
      const errorMessage = '[wdio-visual-regression-service:makeDocumentScreenshot] Failed to capture the element using the "invalid-selector" selector. Either update the test document to include this selector or use a different selector that exists on the document.';

      expect(() => Terra.validates.screenshot('invalid selector', { selector: 'invalid-selector' })).toThrow(errorMessage);
    });
  });

  describe('element', () => {
    it('should validate element and perform accessibility check', () => {
      browser.url('/validates-element.html');

      Terra.validates.element('validates-element');
    });

    it('should validate element with custom selector', () => {
      browser.url('/validates-element.html');

      const options = {
        selector: '#content',
      };

      Terra.validates.element('validates-element-selector', options);
    });

    it('should require a screenshot name', () => {
      const errorMessage = '[terra-functional-testing:element] Terra.validate.element requires a unique test name as the first argument.';

      expect(() => Terra.validates.element()).toThrow(errorMessage);
    });

    it('should fail with invalid selector', () => {
      const errorMessage = '[wdio-visual-regression-service:makeDocumentScreenshot] Failed to capture the element using the "invalid-selector" selector. Either update the test document to include this selector or use a different selector that exists on the document.';

      expect(() => Terra.validates.element('invalid selector', { selector: 'invalid-selector' })).toThrow(errorMessage);
    });
  });

  describe('element out of bound', () => {
    it('should capture screenshot at document size', () => {
      browser.url('/element-out-of-bound.html');

      Terra.validates.screenshot('out of bound left content', { selector: '#out-of-bound-left-content' });
      Terra.validates.screenshot('out of bound right content', { selector: '#out-of-bound-right-content' });
    });
  });
});
