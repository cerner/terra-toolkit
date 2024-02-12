/**
 * This spec file is used for integration testing the Terra.validates commands.
 */
Terra.describeViewports('Terra.validates', ['small', 'large'], () => {
  describe('accessibility', () => {
    it('should report no accessibility violations', async () => {
      await browser.url('/accessible.html');

      await Terra.validates.accessibility();
    });

    it('should report an accessibility violation', async () => {
      await browser.url('/insufficient-color-contrast.html');

      let caughtError;

      try {
        await Terra.validates.accessibility();
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError.message).toEqual(expect.stringContaining('expected no accessibility violations but received'));
    });

    it('should report no accessibility violations when a rule override is provided', async () => {
      await browser.url('/insufficient-color-contrast.html');

      await Terra.validates.accessibility({ rules: { 'color-contrast': { enabled: false } } });
    });
  });

  describe('screenshot', () => {
    it('should validate screenshot without performing accessibility check', async () => {
      await browser.url('/insufficient-color-contrast.html');

      await Terra.validates.screenshot('validates-screenshot');
    });

    it('should require a screenshot name', () => {
      const errorMessage = '[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.';

      expect(async () => {
        await Terra.validates.screenshot();
      }).rejects.toThrow(errorMessage);
    });

    it('should fail with invalid selector', () => {
      const errorMessage = '[wdio-visual-regression-service:makeDocumentScreenshot] Failed to capture the element using the "invalid-selector" selector. Either update the test document to include this selector or use a different selector that exists on the document.';

      expect(async () => {
        await Terra.validates.screenshot('invalid selector', { selector: 'invalid-selector' });
      }).rejects.toThrow(errorMessage);
    });
  });

  describe('element', () => {
    it('should validate element and perform accessibility check', async () => {
      await browser.url('/validates-element.html');

      await Terra.validates.element('validates-element');
    });

    it('should validate element with custom selector', async () => {
      await browser.url('/validates-element.html');

      const options = {
        selector: '#content',
      };

      await Terra.validates.element('validates-element-selector', options);
    });

    it('should require a screenshot name', async () => {
      const errorMessage = '[terra-functional-testing:element] Terra.validate.element requires a unique test name as the first argument.';

      expect(async () => {
        await Terra.validates.element();
      }).rejects.toThrow(errorMessage);
    });

    it('should fail with invalid selector', async () => {
      const errorMessage = '[wdio-visual-regression-service:makeDocumentScreenshot] Failed to capture the element using the "invalid-selector" selector. Either update the test document to include this selector or use a different selector that exists on the document.';

      expect(async () => {
        await Terra.validates.element('invalid selector', { selector: 'invalid-selector' });
      }).rejects.toThrow(errorMessage);
    });
  });

  describe('element out of bound', () => {
    it('should capture screenshot at document size', async () => {
      await browser.url('/element-out-of-bound.html');

      await Terra.validates.screenshot('out of bound left content', { selector: '#out-of-bound-left-content' });
      await Terra.validates.screenshot('out of bound right content', { selector: '#out-of-bound-right-content' });
    });
  });
});
