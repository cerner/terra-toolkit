const { determineConfig } = require('../../../../config/wdio/selenium.config');

// global.console = { log: jest.fn(), warn: jest.fn() };

const chromeCapability = expect.arrayContaining([
  expect.objectContaining({ browserName: 'chrome' }),
]);

const firefoxCapability = expect.arrayContaining([
  expect.objectContaining({ browserName: 'firefox' }),
]);

const ieCapability = expect.arrayContaining([
  expect.objectContaining({ browserName: 'internet explorer' }),
]);

describe('Wdio Selenium Configuration', () => {
  describe('returns default selenium configuration', () => {
    const seleniumConfig = determineConfig({});

    expect(seleniumConfig).toHaveProperty('seleniumVersion', '3.14');
    expect(seleniumConfig).toHaveProperty('maxInstances', 1);
    expect(seleniumConfig).toHaveProperty('seleniumDocker', { enabled: true });
    expect(seleniumConfig).toHaveProperty('capabilities');
  });

  describe('returns selenium configuration when CI env', () => {
    const seleniumConfig = determineConfig({ ci: true });

    expect(seleniumConfig).toHaveProperty('seleniumVersion', '3.14');
    expect(seleniumConfig).toHaveProperty('maxInstances', 1);
    expect(seleniumConfig).toHaveProperty('seleniumDocker', { enabled: false });
    expect(seleniumConfig).toHaveProperty('capabilities');
    expect(seleniumConfig).toHaveProperty('host', 'standalone-chrome');
  });

  describe('returns selenium configuration when useSeleniumGrid env', () => {
    const seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com' });

    expect(seleniumConfig).toHaveProperty('seleniumVersion', '3.14');
    expect(seleniumConfig).toHaveProperty('maxInstances', 1);
    expect(seleniumConfig).toHaveProperty('seleniumDocker', { enabled: false });
    expect(seleniumConfig).toHaveProperty('capabilities');
    expect(seleniumConfig).toHaveProperty('host', 'test.grid.com');
    expect(seleniumConfig).toHaveProperty('port', '80');
    expect(seleniumConfig).toHaveProperty('path', '/wd/hub');
    expect(seleniumConfig).toHaveProperty('agent');
  });

  describe('chrome capabilities', () => {
    it('returns chrome by default', () => {
      const seleniumConfig = determineConfig({});

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).toMatchObject(chromeCapability);

    });

    it('returns chrome when defined via browsers env', () => {
      const seleniumConfig = determineConfig({ browsers: ['chrome'] });

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).toMatchObject(chromeCapability);
    });

    it('returns chrome when seleniumGridUrl env but no browsers env', () => {
      let seleniumConfig;
      expect(seleniumConfig).toEqual(undefined);

      seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com' });

      expect(seleniumConfig.capabilities).toHaveLength(3);
      expect(seleniumConfig.capabilities).toMatchObject(chromeCapability);

    });

    it('returns chrome when seleniumGridUrl env and browsers env', () => {
      const seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com', browsers: ['chrome'] });

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).toMatchObject(chromeCapability);
    });

    it('does not return chrome when chrome is not defined', () => {
      const seleniumConfig = determineConfig({ browsers: ['firefox'] });

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).not.toMatchObject(chromeCapability);
    });
  });

  describe('firefox capabilities', () => {
    it('returns firefox when defined via browsers env', () => {
      const seleniumConfig = determineConfig({ browsers: ['firefox'] });

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).toMatchObject(firefoxCapability);
    });

    it('returns firefox when seleniumGridUrl env but no browsers env', () => {
      let seleniumConfig;
      expect(seleniumConfig).toEqual(undefined);

      seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com' });

      expect(seleniumConfig.capabilities).toHaveLength(3);
      expect(seleniumConfig.capabilities).toMatchObject(firefoxCapability);
    });

    it('returns firefox when seleniumGridUrl env and browsers env', () => {
      const seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com', browsers: ['firefox'] });

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).toMatchObject(firefoxCapability);
    });
  });


  describe('ie capabilities', () => {
    it('does not return ie when defined via browsers env and not seleniumGridUrl', () => {
      const seleniumConfig = determineConfig({ browsers: ['ie'] });

      expect(seleniumConfig.capabilities).toHaveLength(0);
      expect(seleniumConfig.capabilities).not.toMatchObject(ieCapability);
    });

    it('returns ie when seleniumGridUrl env but no browsers env', () => {
      let seleniumConfig;
      expect(seleniumConfig).toEqual(undefined);

      seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com' });

      expect(seleniumConfig.capabilities).toHaveLength(3);
      expect(seleniumConfig.capabilities).toMatchObject(ieCapability);
    });

    it('returns ie when seleniumGridUrl env and browsers env', () => {
      const seleniumConfig = determineConfig({ seleniumGridUrl: 'test.grid.com', browsers: ['ie'] });

      expect(seleniumConfig.capabilities).toHaveLength(1);
      expect(seleniumConfig.capabilities).toMatchObject(ieCapability);
    });
  });
});
