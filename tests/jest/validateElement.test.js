jest.mock('../../lib/wdio/services/TerraCommands/accessibility', () => ({
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

const accessibility = require('../../lib/wdio/services/TerraCommands/accessibility').default;
const visualRegressions = require('../../lib/wdio/services/TerraCommands/visual-regression').default;
const { validatesElement } = require('../../lib/wdio/services/TerraCommands/validate-element').default;

global.browser = {
  options: {
    terra: {
      selector: '[data-terra-toolkit-content]',
    },
  },
};

describe('validateElement', () => {
  it('calls the appropriate methods downstream with all arguments', () => {
    validatesElement('test name', { selector: 'test-selector', misMatchTolerance: 0.05, axeRules: { a: 'b', c: 'd' } });

    expect(visualRegressions.runMatchScreenshotTest).toBeCalledWith('test-selector', { misMatchTolerance: 0.05, name: 'test name' });
    expect(accessibility.runAccessibilityTest).toBeCalledWith({ rules: { a: 'b', c: 'd' } });
  });

  it('calls the appropriate methods downstream with defaults', () => {
    validatesElement();

    expect(visualRegressions.runMatchScreenshotTest).toBeCalledWith('[data-terra-toolkit-content]', { name: 'default' });
    expect(accessibility.runAccessibilityTest).toBeCalled();
  });

  it('does not use context option', () => {
    validatesElement({ selector: 'test-selector', context: 'im_sneaky_and_will_test_a_diff_element_for_a11y' });

    expect(visualRegressions.runMatchScreenshotTest).toBeCalledWith('test-selector', { name: 'default' });
    expect(accessibility.runAccessibilityTest).toBeCalled();
  });
});
