const getDefaultThemeName = require('../../../../src/config/utils/getDefaultThemeName');

describe('getDefaultThemeName', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('returns terra-default-theme when no default is specified', () => {
    jest.mock('../../../../../../terra-theme.config', () => ({}));

    const defaultThemeName = getDefaultThemeName();

    expect(defaultThemeName).toEqual('terra-default-theme');
  });

  it('returns the default specified in the config file', () => {
    jest.mock('../../../../../../terra-theme.config', () => ({ theme: 'mock-theme' }));

    const defaultThemeName = getDefaultThemeName();

    expect(defaultThemeName).toEqual('mock-theme');
  });
});
