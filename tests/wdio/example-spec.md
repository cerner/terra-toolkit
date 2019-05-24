// Example of current & proposed test changes
const testViewports = ['tiny', 'huge'];
const viewports = Terra.viewports(testViewports);

describe('current test [passing viewports]', () => {
  beforeEach(() => {
    browser.url('/compare.html');
    browser.click('button');
  });

  Terra.should.matchScreenshot({ viewports });
  Terra.should.beAccessible({ viewports });
  // Terra.should.validateElement(); doesn't accept a viewports option 
});

describe('new change proposal [passing viewports new it helpers]', () => {
  beforeEach(() => {
    browser.url('/compare.html');
    browser.click('button');
  });
  Terra.should.matchScreenshot({ viewports, selector: '#root' });
  Terra.it.matchesScreenshot({ viewports, selector: '#root' });

  Terra.should.beAccessible({ viewports, context: '#root' });
  // context is not longer used. just remove.
  Terra.it.isAccessible({ viewports });
  // Terra.should.validateElement(); still won't accept a viewports option 
});

describe('new change proposal [passing viewports direct helper usage]', () => {
  before(() => {
    browser.url('/compare.html');
  });

  it('click the button and validates', () => {
    browser.click('button');
    Terra.validates.screenshot({ viewports });
    Terra.validates.accessibility({ viewports });
  });
});

viewports.forEach((viewport) => {
  describe('current test [looping viewports]', () => {
    before(() => {
      browser.setViewportSize(viewport);
    });

    describe('test', () => {
      beforeEach(() => {
        browser.url('/compare.html');
        browser.click('button');
      });

      Terra.should.validateElement();
    });
  });
});

Terra.describeWithViewports('5. new change proposal [looping viewport describe block helper]', ['tiny', 'huge'], () => {
  describe('with it block helper', () => {
    before(() => {
      browser.url('/compare.html');
      browser.click('button');
    });

    Terra.it.matchesScreenshot();
    Terra.it.isAccessible();
    Terra.it.validatesElement();
  });

  describe('using directly', () => {
    it('click the button and validates', () => {
      browser.click('button');
      Terra.validates.screenshot();
      Terra.validates.accessibility();
      Terra.validates.element();
    });
  });
});
