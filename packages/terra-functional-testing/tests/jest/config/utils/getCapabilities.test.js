const getCapabilities = require('../../../../src/config/utils/getCapabilities');

describe('getCapabilities', () => {
  it('should return chrome by default', () => {
    const capabilities = getCapabilities();

    expect(capabilities.length).toEqual(1);
    expect(capabilities[0].browserName).toEqual('chrome');
  });

  it('should return chrome if browsers is an empty array', () => {
    const capabilities = getCapabilities([]);

    expect(capabilities.length).toEqual(1);
    expect(capabilities[0].browserName).toEqual('chrome');
  });

  it('should return all browsers if none are provided and the selenium grid is enabled', () => {
    const capabilities = getCapabilities(undefined, true);

    expect(capabilities.length).toEqual(3);
  });

  it('should exclude ie if the selenium grid is not enabled', () => {
    const capabilities = getCapabilities(['chrome', 'firefox', 'ie']);

    expect(capabilities.length).toEqual(2);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'internet explorer')).toEqual(-1);
  });

  it('should include only chrome', () => {
    const capabilities = getCapabilities(['chrome']);

    expect(capabilities.length).toEqual(1);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'chrome')).toBeGreaterThanOrEqual(0);
  });

  it('should include chrome and firefox', () => {
    const capabilities = getCapabilities(['chrome', 'firefox']);

    expect(capabilities.length).toEqual(2);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'chrome')).toBeGreaterThanOrEqual(0);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'firefox')).toBeGreaterThanOrEqual(0);
  });

  it('should include only ie', () => {
    const capabilities = getCapabilities(['ie'], true);

    expect(capabilities.length).toEqual(1);
    expect(capabilities[0].browserName).toEqual('internet explorer');
  });

  it('should include only chrome if provided as a string', () => {
    const capabilities = getCapabilities('chrome');

    expect(capabilities.length).toEqual(1);
    expect(capabilities[0].browserName).toEqual('chrome');
  });

  it('should include chrome and firefox when provided as a string', () => {
    const capabilities = getCapabilities('[chrome, firefox]');

    expect(capabilities.length).toEqual(2);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'chrome')).toBeGreaterThanOrEqual(0);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'firefox')).toBeGreaterThanOrEqual(0);
  });

  it('should include chrome and firefox when provided as a comma delimited  string', () => {
    const capabilities = getCapabilities('chrome,firefox');

    expect(capabilities.length).toEqual(2);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'chrome')).toBeGreaterThanOrEqual(0);
    expect(capabilities.findIndex(({ browserName }) => browserName === 'firefox')).toBeGreaterThanOrEqual(0);
  });
});
