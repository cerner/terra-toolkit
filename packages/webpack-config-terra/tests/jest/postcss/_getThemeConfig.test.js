const getThemeConfig = require('../../../lib/utils/_getThemeConfig');

describe('get Theme Config', () => {
  it('returns empty if nothing can be found', () => {
    expect(getThemeConfig()).toEqual({
      scoped: ['clinical-lowlight-theme', 'orion-fusion-theme'],
    });
  });
});
