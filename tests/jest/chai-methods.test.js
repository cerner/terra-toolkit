import chaiMethods from '../../src/wdio/services/TerraCommands/chai-methods';

describe('getComparisonResults', () => {
  it('guards against an empty array of screenshots', () => {
    const result = chaiMethods.getComparisonResults([], 'exactly');
    expect(result).toBe('No screenshots to compare.');
  });
});
