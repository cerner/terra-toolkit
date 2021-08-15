const getOutputDir = require('../../../../src/reporters/spec-reporter/get-output-dir');

describe('getOutputDir', () => {
  it('should return the expected output directory', () => {
    const outputDir = getOutputDir();

    expect(outputDir).toEqual(expect.stringContaining('/tests/wdio/reports'));
  });
});
