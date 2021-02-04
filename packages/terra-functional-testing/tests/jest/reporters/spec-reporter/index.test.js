const { cleanResults, mergeResults, SpecReporter } = require('../../../../src/reporters/spec-reporter/index');

describe('Spec Reporter Index', () => {
  it('should export the the spec reporter and utility functions', () => {
    expect(cleanResults).toBeDefined();
    expect(mergeResults).toBeDefined();
    expect(SpecReporter).toBeDefined();
  });
});
