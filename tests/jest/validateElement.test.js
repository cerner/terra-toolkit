jest.mock('../../lib/wdio/services/TerraCommands/accessiblity', () => ({
  __esModule: true,
  default: {
    accessibleItBlock: jest.fn(),
  },
}));
jest.mock('../../lib/wdio/services/TerraCommands/visual-regression', () => ({
  __esModule: true,
  default: {
    screenshotItBlock: jest.fn(),
  },
}));

const accessibility = require('../../lib/wdio/services/TerraCommands/accessiblity').default;
const visualRegressions = require('../../lib/wdio/services/TerraCommands/visual-regression').default;
const validateElement = require('../../lib/wdio/services/TerraCommands/validate-element').default;

global.browser = {
  options: {
    terra: {
      selector: '[data-terra-toolkit-content]',
    },
  },
};

describe('validateElement', () => {
  it('calls the appropriate methods downstream with all arguments', () => {
    validateElement('test name', { selector: 'test-selector', misMatchTolerance: 0.05, axeRules: { a: 'b', c: 'd' } });

    expect(visualRegressions.screenshotItBlock).toBeCalledWith('test name', 'test-selector', { misMatchTolerance: 0.05 });
    expect(accessibility.accessibleItBlock).toBeCalledWith({ rules: { a: 'b', c: 'd' }, context: 'test-selector' });
  });

  it('calls the appropriate methods downstream with defaults', () => {
    validateElement();

    expect(visualRegressions.screenshotItBlock).toBeCalledWith('default', '[data-terra-toolkit-content]', { });
    expect(accessibility.accessibleItBlock).toBeCalledWith({ context: '[data-terra-toolkit-content]' });
  });

  it('does not use context option', () => {
    validateElement({ selector: 'test-selector', context: 'im_sneaky_and_will_test_a_diff_element_for_a11y' });

    expect(visualRegressions.screenshotItBlock).toBeCalledWith('default', 'test-selector', { });
    expect(accessibility.accessibleItBlock).toBeCalledWith({ context: 'test-selector' });
  });
});
