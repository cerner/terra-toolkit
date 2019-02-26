const accessibility = require('../../lib/wdio/services/TerraCommands/accessiblity').default;
const visualRegressions = require('../../lib/wdio/services/TerraCommands/visual-regression').default;

describe('validateElement', () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
      browser.setViewportSize(Terra.viewports('tiny')[0]);
    });

    Terra.should.validateElement();
  });

  it('calls the appropriate methods downstream with all arguments', () => {
    const oldAccessible = accessibility.beAccessible;

    let accessibilityOptions;
    accessibility.beAccessible = (options) => {
      accessibilityOptions = options;
    };

    const oldScreenshotItBlock = visualRegressions.screenshotItBlock;
    let screenshotItBlockName;
    let screenshotItBlockMatchType;
    let screenshotItBlockSelector;
    let screenshotItBlockOptions;
    visualRegressions.screenshotItBlock = (name, matchType, selector, options) => {
      screenshotItBlockName = name;
      screenshotItBlockMatchType = matchType;
      screenshotItBlockSelector = selector;
      screenshotItBlockOptions = options;
    };

    Terra.should.validateElement('test name', { selector: 'test-selector', misMatchTolerance: 0.05, axeRules: { a: 'b', c: 'd' } });

    expect(accessibilityOptions).to.deep.equal({ rules: { a: 'b', c: 'd' }, restoreScroll: true, context: 'test-selector' });
    expect(screenshotItBlockName).to.equal('test name');
    expect(screenshotItBlockMatchType).to.equal('withinTolerance');
    expect(screenshotItBlockSelector).to.equal('test-selector');
    expect(screenshotItBlockOptions).to.deep.equal({ misMatchTolerance: 0.05 });

    accessibility.beAccessible = oldAccessible;
    visualRegressions.screenshotItBlock = oldScreenshotItBlock;
  });

  it('calls the appropriate methods downstream with defaults', () => {
    const oldAccessible = accessibility.beAccessible;

    let accessibilityOptions;
    accessibility.beAccessible = (options) => {
      accessibilityOptions = options;
    };

    const oldScreenshotItBlock = visualRegressions.screenshotItBlock;
    let screenshotItBlockName;
    let screenshotItBlockMatchType;
    let screenshotItBlockSelector;
    let screenshotItBlockOptions;
    visualRegressions.screenshotItBlock = (name, matchType, selector, options) => {
      screenshotItBlockName = name;
      screenshotItBlockMatchType = matchType;
      screenshotItBlockSelector = selector;
      screenshotItBlockOptions = options;
    };

    Terra.should.validateElement();

    expect(accessibilityOptions).to.deep.equal({ restoreScroll: true, context: '[data-terra-toolkit-content]' });
    expect(screenshotItBlockName).to.equal('default');
    expect(screenshotItBlockMatchType).to.equal('withinTolerance');
    expect(screenshotItBlockSelector).to.equal('[data-terra-toolkit-content]');
    expect(screenshotItBlockOptions).to.deep.equal({ misMatchTolerance: 0.01 });

    accessibility.beAccessible = oldAccessible;
    visualRegressions.screenshotItBlock = oldScreenshotItBlock;
  });
});
