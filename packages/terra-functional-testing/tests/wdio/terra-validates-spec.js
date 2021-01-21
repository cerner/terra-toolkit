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
      let caughtError;
  
      try {
        Terra.validates.screenshot();
      } catch (error) {
        caughtError = error;
      }
  
      expect(caughtError.message).toEqual('[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.');
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
      let caughtError;
  
      try {
        Terra.validates.element();
      } catch (error) {
        caughtError = error;
      }
  
      expect(caughtError.message).toEqual('[terra-functional-testing:element] Terra.validate.element requires a unique test name as the first argument.');
    });
  });
});
