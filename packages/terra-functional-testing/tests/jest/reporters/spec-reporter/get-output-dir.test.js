const fs = require('fs');
const getDefaultDir = require('../../../../src/reporters/spec-reporter/get-output-dir');

describe('Get Output Dir', () => {
  afterEach(() => {
    // Restore all fs mocks.
    jest.restoreAllMocks();
  });

  it('should return test as the output directory if it exists', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);

    const outputDir = getDefaultDir();

    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('/test'));
    expect(outputDir).toEqual(expect.stringContaining('/test/wdio/reports'));
  });

  it('should return tests as the output directory if test does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);

    const outputDir = getDefaultDir();

    expect(outputDir).toEqual(expect.stringContaining('/tests/wdio/reports'));
  });
});
