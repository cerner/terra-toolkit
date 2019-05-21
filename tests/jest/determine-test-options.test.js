const determineOptions = require('../../lib/wdio/services/TerraCommands/determine-test-options').default;

global.browser = {
  options: {
    terra: {
      selector: '[data-terra-toolkit-content]',
    },
  },
};

describe('screenshotOptions', () => {
  it('returns defaults', () => {
    const options = determineOptions.screenshotOptions([]);

    expect(options).toHaveProperty('name', 'default');
    expect(options).toHaveProperty('selector', '[data-terra-toolkit-content]');
    expect(options).not.toHaveProperty('viewports');
    expect(options).not.toHaveProperty('misMatchTolerance');
  });

  it('honors custom name', () => {
    const options = determineOptions.screenshotOptions(['myScreenshot']);

    expect(options).toHaveProperty('name', 'myScreenshot');
  });

  it('honors custom selector', () => {
    const options = determineOptions.screenshotOptions([{ selector: 'custom-id' }]);

    expect(options).toHaveProperty('selector', 'custom-id');
  });

  it('honors custom viewports', () => {
    const customViewport = { width: 100, height: 100 };
    const options = determineOptions.screenshotOptions([{ viewports: [customViewport] }]);

    expect(options).toHaveProperty('viewports', [customViewport]);
  });

  it('honors custom misMatchTolerance', () => {
    const options = determineOptions.screenshotOptions([{ misMatchTolerance: 0.2 }]);

    expect(options).toHaveProperty('misMatchTolerance', 0.2);
  });

  it('honors custom name and options', () => {
    const options = determineOptions.screenshotOptions(['myScreenshot', { selector: 'custom-id', misMatchTolerance: 0.2 }]);

    expect(options).toHaveProperty('name', 'myScreenshot');
    expect(options).toHaveProperty('selector', 'custom-id');
    expect(options).toHaveProperty('misMatchTolerance', 0.2);
  });
});

describe('axeOptions', () => {
  it('returns defaults', () => {
    const options = determineOptions.axeOptions([]);

    expect(options).not.toHaveProperty('viewports');
    expect(options).not.toHaveProperty('rules');
  });

  it('honors custom viewports', () => {
    const customViewport = { width: 100, height: 100 };
    const options = determineOptions.axeOptions([{ viewports: [customViewport] }]);

    expect(options).toHaveProperty('viewports', [customViewport]);
  });

  it('honors custom rule', () => {
    const customRule = { id: 'landmark-one-main', enabled: false };
    const options = determineOptions.axeOptions([{ rules: [customRule] }]);

    expect(options).toHaveProperty('rules', [customRule]);
  });

  it('honors custom rule', () => {
    const customRule = { id: 'landmark-one-main', enabled: false };
    const options = determineOptions.axeOptions([{ axeRules: [customRule] }]);

    expect(options).toHaveProperty('rules', [customRule]);
  });

  it('cannot specify runOnly options', () => {
    const options = determineOptions.axeOptions([{ runOnly: ['stuff'] }]);

    expect(options).not.toHaveProperty('runOnly');
  });
});
