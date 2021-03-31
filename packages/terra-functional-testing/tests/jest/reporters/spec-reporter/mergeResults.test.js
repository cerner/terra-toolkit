const fs = require('fs');
const path = require('path');
const getOutputDir = require('../../../../src/reporters/spec-reporter/get-output-dir');
const mergeResults = require('../../../../src/reporters/spec-reporter/merge-results');
const cleanResults = require('../../../../src/reporters/spec-reporter/clean-results');
const mergedResults = require('../../../fixtures/reporters/results-chrome-terra-functional-testing.json');
const mergedResultsScoped = require('../../../fixtures/reporters-scoped/results-chrome-terra-functional-testing.json');

jest.mock('../../../../src/reporters/spec-reporter/clean-results');
jest.mock('../../../../src/reporters/spec-reporter/get-output-dir', () => (
  jest.fn().mockImplementation(() => ('/mock/'))
));

describe('mergeResults', () => {
  afterEach(() => {
    // Restore all fs mocks.
    jest.restoreAllMocks();
  });

  it('should retrieve the default output directory if one is not provided', () => {
    mergeResults();

    expect(getOutputDir).toHaveBeenCalled();
  });

  it('should return early if the output directory does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);

    mergeResults();

    expect(fs.existsSync).toHaveBeenCalledWith('/mock/');
    expect(cleanResults).toHaveBeenCalledTimes(0);
  });

  it('should write the merged results to file', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {});

    getOutputDir.mockImplementationOnce(() => (path.resolve(__dirname, '../../../fixtures/reporters')));

    mergeResults();

    expect(cleanResults).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('results-chrome-terra-functional-testing'), JSON.stringify(mergedResults, null, 2));
  });

  it('should write the merged results to file with scoped packaged name', () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {});

    getOutputDir.mockImplementationOnce(() => (path.resolve(__dirname, '../../../fixtures/reporters-scoped')));

    mergeResults();

    expect(cleanResults).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining('results-chrome-terra-functional-testing'), JSON.stringify(mergedResultsScoped, null, 2));
  });
});
