jest.mock('../../lib/wdio/services/TerraCommands/accessiblity', () => ({
  __esModule: true,
  default: {
    runAccessibilityTest: jest.fn(),
  },
}));
jest.mock('../../lib/wdio/services/TerraCommands/visual-regression', () => ({
  __esModule: true,
  default: {
    runMatchScreenshotTest: jest.fn(),
  },
}));

const accessibility = require('../../lib/wdio/services/TerraCommands/accessiblity').default;
const visualRegressions = require('../../lib/wdio/services/TerraCommands/visual-regression').default;
const validateMethods = require('../../lib/wdio/services/TerraCommands/validate-element').default;

describe('validateElement', () => {
  it('calls the appropriate methods downstream with all arguments', () => {
    validateMethods.validatesElement('test name', { selector: 'test-selector', misMatchTolerance: 0.05, axeRules: { a: 'b', c: 'd' } });

    expect(accessibility.runAccessibilityTest).toBeCalledWith({ rules: { a: 'b', c: 'd' }, restoreScroll: true, context: 'test-selector' });
    expect(visualRegressions.runMatchScreenshotTest).toBeCalledWith('withinTolerance', 'test-selector', { misMatchTolerance: 0.05, name: 'test name' });
  });

  it('calls the appropriate methods downstream with defaults', () => {
    global.browser = {
      options: {
        terra: {
          selector: '[data-terra-toolkit-content]',
        },
        visualRegression: {
          compare: {
            misMatchTolerance: 0.01,
          },
        },
      },
    };

    validateMethods.validatesElement();

    expect(accessibility.runAccessibilityTest).toBeCalledWith({ restoreScroll: true, context: '[data-terra-toolkit-content]' });
    expect(visualRegressions.runMatchScreenshotTest).toBeCalledWith('withinTolerance', '[data-terra-toolkit-content]', { misMatchTolerance: 0.01, name: 'default' });
  });
});
