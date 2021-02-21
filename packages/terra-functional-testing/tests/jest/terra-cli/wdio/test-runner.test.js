jest.mock('@cerner/terra-cli/lib/utils/Logger');

const fs = require('fs');
const path = require('path');
const TestRunner = require('../../../../src/terra-cli/wdio/test-runner');

jest.mock('@wdio/cli', () => ({
  default: jest.fn().mockImplementation(() => ({ run: () => Promise.resolve(0) })),
}));

describe('Test Runner', () => {
  describe('run', () => {
    it('should run the wdio cli launcher', async () => {
      jest.spyOn(TestRunner, 'configPath').mockImplementationOnce(() => '/example/path');

      await TestRunner.run({ config: '/config/path' });

      expect(TestRunner.configPath).toHaveBeenCalledWith('/config/path');
    });

    it('should catch errors that occur trying to launch the runner', async () => {
      const mockError = new Error('Mock Error');

      jest.spyOn(TestRunner, 'configPath').mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(process, 'exit').mockImplementationOnce(() => { });

      await expect(TestRunner.run({ config: '/config/path' })).rejects.toThrow(mockError);

      expect(TestRunner.configPath).toHaveBeenCalledWith('/config/path');
    });
  });

  describe('configPath', () => {
    it('should return a resolved path to the file', () => {
      jest.spyOn(path, 'resolve').mockImplementationOnce((configPath) => `/mock/path/${configPath}`);

      const configPath = TestRunner.configPath('mock-path');

      expect(configPath).toEqual('/mock/path/mock-path');
      expect(path.resolve).toHaveBeenCalledWith('mock-path');
    });

    it('should return the relative configuration if one exists', () => {
      jest.spyOn(process, 'cwd').mockImplementationOnce(() => '/cwd');
      jest.spyOn(path, 'resolve').mockImplementationOnce((arg1, arg2) => `${arg1}/${arg2}`);
      jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);

      const configPath = TestRunner.configPath();

      expect(configPath).toEqual('/cwd/wdio.conf.js');
      expect(process.cwd).toHaveBeenCalled();
      expect(path.resolve).toHaveBeenCalledWith('/cwd', 'wdio.conf.js');
      expect(fs.existsSync).toHaveBeenCalledWith('/cwd/wdio.conf.js');
    });

    it('should return the default configuration if a config path is not provided and a relative path does not exist', () => {
      jest.spyOn(process, 'cwd').mockImplementationOnce(() => '/cwd');
      jest.spyOn(path, 'resolve').mockImplementationOnce((arg1, arg2) => `${arg1}/${arg2}`);
      jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);

      const configPath = TestRunner.configPath();
      const expectedPath = path.resolve(__dirname, '../../../../src/config/wdio.conf.js');

      expect(configPath).toEqual(expectedPath);
      expect(process.cwd).toHaveBeenCalled();
      expect(path.resolve).toHaveBeenCalledWith('/cwd', 'wdio.conf.js');
      expect(fs.existsSync).toHaveBeenCalledWith('/cwd/wdio.conf.js');
    });
  });

  describe('start', () => {
    it('should initiate a test runner for each theme and locale permutation', async () => {
      jest.spyOn(TestRunner, 'run').mockImplementation(() => Promise.resolve());

      await TestRunner.start({ config: '/path', locales: ['en', 'fr'], themes: ['terra-default-theme', 'terra-mock-theme'] });

      expect(TestRunner.run).toHaveBeenCalledTimes(4);
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'en', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'fr', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'en', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'fr', launcherOptions: {},
      });
    });

    it('should initiate a test runner for each theme, locale, and form factor permutation', async () => {
      jest.spyOn(TestRunner, 'run').mockImplementation(() => Promise.resolve());

      await TestRunner.start({
        config: '/path',
        locales: ['en', 'fr'],
        themes: ['terra-default-theme', 'terra-mock-theme'],
        formFactors: ['tiny', 'large'],
      });

      expect(TestRunner.run).toHaveBeenCalledTimes(8);
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'en', formFactor: 'tiny', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'en', formFactor: 'large', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'fr', formFactor: 'tiny', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'fr', formFactor: 'large', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'en', formFactor: 'tiny', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'en', formFactor: 'large', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'fr', formFactor: 'tiny', launcherOptions: {},
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'fr', formFactor: 'large', launcherOptions: {},
      });
    });

    it('should initiate a test runner with custom hostname and port options', async () => {
      jest.spyOn(TestRunner, 'run').mockImplementation(() => Promise.resolve());

      await TestRunner.start({
        config: '/path',
        locales: ['en'],
        themes: ['terra-default-theme'],
        hostname: 'hostname',
        port: 8080,
        baseUrl: '/',
        suite: 'test-suite',
        spec: '/spec/',
        keepAliveSeleniumDockerService: true,
        updateScreenshots: true,
      });

      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path',
        theme: 'terra-default-theme',
        locale: 'en',
        hostname: 'hostname',
        port: 8080,
        baseUrl: '/',
        suite: 'test-suite',
        spec: '/spec/',
        launcherOptions: {
          keepAliveSeleniumDockerService: true,
          updateScreenshots: true,
        },
      });
    });

    it('should set env variables', async () => {
      jest.spyOn(TestRunner, 'run').mockImplementation(() => Promise.resolve());

      await TestRunner.start({
        assetServerPort: 8080,
        baseUrl: 'http://localhost:8080',
        browsers: ['ie', 'chrome'],
        config: '/path',
        disableSeleniumService: true,
        externalPort: 8000,
        formFactors: ['large'],
        gridUrl: 'localhost',
        hostname: 'hostname',
        keepAliveSeleniumDockerService: true,
        locales: ['en'],
        port: 8080,
        site: 'build',
        spec: '/spec/',
        suite: 'test-suite',
        themes: ['terra-default-theme'],
        updateScreenshots: true,
      });

      expect(process.env.WDIO_INTERNAL_PORT).toEqual('8080');
      expect(process.env.BROWSERS).toEqual('ie,chrome');
      expect(process.env.WDIO_DISABLE_SELENIUM_SERVICE).toEqual('true');
      expect(process.env.WDIO_EXTERNAL_PORT).toEqual('8000');
      expect(process.env.SELENIUM_GRID_URL).toEqual('localhost');
      expect(process.env.WDIO_HOSTNAME).toEqual('hostname');
      expect(process.env.SITE).toEqual('build');
      expect(TestRunner.run).toHaveBeenCalledWith({
        baseUrl: 'http://localhost:8080',
        config: '/path',
        formFactor: 'large',
        hostname: 'hostname',
        locale: 'en',
        port: 8080,
        spec: '/spec/',
        suite: 'test-suite',
        theme: 'terra-default-theme',
        launcherOptions: {
          keepAliveSeleniumDockerService: true,
          updateScreenshots: true,
        },
      });
    });
  });
});
