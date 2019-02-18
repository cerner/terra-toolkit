/* global describe, it, expect, Terra */

const accessibility = require('../../lib/wdio/services/TerraCommands/accessiblity').default;
const visualRegressions = require('../../lib/wdio/services/TerraCommands/visual-regression').default;

describe('matchScreenshotAndTestStandards', () => {
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
