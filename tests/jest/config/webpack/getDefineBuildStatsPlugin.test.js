const mockDefinePluginInstance = {};
jest.mock('webpack/lib/DefinePlugin', () => mockDefinePluginInstance);

const DefinePlugin = require('webpack/lib/DefinePlugin');
const getDefineBuildStatsPlugin = require('../../../../config/webpack/getDefineBuildStatsPlugin');

describe('getDefineBuildStatsPlugin', () => {
  it('returns an instance of the DefinePlugin with appropriate values defined', () => {
    const result = getDefineBuildStatsPlugin();

    expect(result).toBe(mockDefinePluginInstance);
    expect(DefinePlugin).toHaveBeenCalledWith({});
  });
});
