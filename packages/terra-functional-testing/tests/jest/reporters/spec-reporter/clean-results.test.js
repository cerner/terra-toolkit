const fs = require('fs');
const cleanResults = require('../../../../src/reporters/spec-reporter/clean-results');
const getOutputDir = require('../../../../src/reporters/spec-reporter/get-output-dir');

jest.mock('../../../../src/reporters/spec-reporter/get-output-dir', () => (
  jest.fn().mockImplementation(() => ('/mock/'))
));

describe('cleanResults', () => {
  afterEach(() => {
    // Restore all fs mocks.
    jest.restoreAllMocks();
  });

  it('should retrieve the default directory if a directory is not provided', () => {
    cleanResults();

    expect(getOutputDir).toHaveBeenCalled();
  });

  it('should return if the directory does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => []);

    cleanResults();

    expect(fs.existsSync).toHaveBeenCalledWith('/mock/');
    expect(fs.readdirSync).toHaveBeenCalledTimes(0);
  });

  it('should unlink each spec result file in the output directory', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => ([
      'wdio-spec-results-0-0',
      'wdio-spec-results-0-1',
      'not-spec-0-0',
      'wdio-spec-results-0-2',
      'wdio-spec-results-0-3',
      'not-spec-0-1',
    ]));
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

    cleanResults();

    expect(fs.existsSync).toHaveBeenCalledWith('/mock/');
    expect(fs.readdirSync).toHaveBeenCalledWith('/mock/');
    expect(fs.unlinkSync).toHaveBeenCalledTimes(4);
  });
});
