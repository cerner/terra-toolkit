const accessibility = require('../../lib/wdio/services/TerraCommands/accessiblity').default;
const visualRegressions = require('../../lib/wdio/services/TerraCommands/visual-regression').default;

describe('matchScreenshotAndTestStandards', () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
      browser.setViewportSize(Terra.viewports('tiny')[0]);
    });

    Terra.should.matchScreenshotAndTestStandards();
  });

  it('calls the appropriate methods downstream with a name', () => {
    const oldAccessible = accessibility.beAccessible;

    let accessibilityCalled = false;
    accessibility.beAccessible = () => {
      accessibilityCalled = true;
    };

    const oldMatchScreenshotImplementation = visualRegressions.matchScreenshotImplementation;
    let matchScreenshotImplementationName;
    visualRegressions.matchScreenshotImplementation = (name) => {
      matchScreenshotImplementationName = name;
    };

    Terra.should.matchScreenshotAndTestStandards('test name');

    expect(accessibilityCalled).to.equal(true);
    expect(matchScreenshotImplementationName).to.equal('test name');

    accessibility.beAccessible = oldAccessible;
    visualRegressions.matchScreenshotImplementation = oldMatchScreenshotImplementation;
  });
});
