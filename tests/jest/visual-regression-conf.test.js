import visualRegressionConfig from '../../config/wdio/visualRegressionConf';

const { terraViewports } = require('../../config/wdio/services.default-config');

const mockContext = {
  desiredCapabilities: { browserName: 'chrome' },
  test: {
    type: 'beforeTest',
    title: 'Sample Title',
    parent: 'Same Parent Description',
    file: '/tests/sample-spec.js',
  },
  meta: {
    viewport: { width: 470, height: 768 },
  },
};

global.browser = { options: {} };

describe('Visual Regression Config', () => {
  it('uses the width in the current browser context to generate the appropriate screenshot location.', () => {
    const expectedReferenceFilePath = '/tests/__snapshots__/reference/en/chrome_tiny/sample-spec/Same_Parent_Description[Sample_Title].png';

    expect(visualRegressionConfig.compare.getReferencefile(mockContext)).toEqual(expectedReferenceFilePath);
  });

  it('defaults to \'enornmous\' form factor if the width in the current browser context is not supported.', () => {
    mockContext.meta.viewport.width = terraViewports.enormous.width + 100;
    const expectedReferenceFilePath = '/tests/__snapshots__/reference/en/chrome_enormous/sample-spec/Same_Parent_Description[Sample_Title].png';

    expect(visualRegressionConfig.compare.getReferencefile(mockContext)).toEqual(expectedReferenceFilePath);
  });
});
