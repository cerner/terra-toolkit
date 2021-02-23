jest.mock('@cerner/terra-cli/lib/utils/Logger');

const fs = require('fs');
const path = require('path');
const Launcher = require('@wdio/cli').default;
const TestRunner = require('../../../../src/terra-cli/wdio/test-runner');
const getCapabilities = require('../../../../src/config/utils/getCapabilities');
const getIpAddress = require('../../../../src/config/utils/getIpAddress');
const SeleniumDockerService = require('../../../../src/services/wdio-selenium-docker-service');
const TerraService = require('../../../../src/services/wdio-terra-service');
const AssetServerService = require('../../../../src/services/wdio-asset-server-service');
const VisualRegressionLauncher = require('../../../../src/services/wdio-visual-regression-service');

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

    it('should run the wdio cli launcher with options', async () => {
      jest.spyOn(TestRunner, 'configPath').mockImplementationOnce(() => '/example/path');

      await TestRunner.run({
        assetServerPort: 8080,
        baseUrl: '/',
        browsers: ['chrome'],
        config: '/path',
        disableSeleniumService: true,
        externalHost: 'externalHost',
        externalPort: 3000,
        formFactor: 'small',
        gridUrl: 'http',
        hostname: 'hostname',
        keepAliveSeleniumDockerService: true,
        locale: 'en',
        port: 8080,
        site: 'build',
        spec: '/spec/',
        suite: 'test-suite',
        theme: 'terra-default-theme',
        updateScreenshots: true,
      });

      const capabilities = getCapabilities(['chrome'], true);
      const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');

      const launcherOptions = {
        baseUrl: 'http://externalHost:3000',
        capabilities,
        hostname: 'http',
        port: 80,
        spec: '/spec/',
        suite: 'test-suite',
        services: [
          [TerraService, {
            formFactor: 'small',
            theme: 'terra-default-theme',
          }],
          [AssetServerService, {
            locale: 'en',
            port: 8080,
            site: 'build',
            theme: 'terra-default-theme',
            webpackConfig: defaultWebpackPath,
          }],
          [VisualRegressionLauncher, {
            locale: 'en',
            theme: 'terra-default-theme',
            updateScreenshots: true,
          }],
        ],
        launcherOptions: {
          disableSeleniumService: true,
          assetServerPort: 8080,
          formFactor: 'small',
          keepAliveSeleniumDockerService: true,
          locale: 'en',
          site: 'build',
          theme: 'terra-default-theme',
          updateScreenshots: true,
        },
      };

      expect(Launcher).toHaveBeenCalledWith('/example/path', launcherOptions);
    });

    it('should add SeleniumDockerService service to wdio cli launcher', async () => {
      jest.spyOn(TestRunner, 'configPath').mockImplementationOnce(() => '/example/path');

      await TestRunner.run({
        disableSeleniumService: false,
      });

      const capabilities = getCapabilities(undefined, false);
      const defaultWebpackPath = path.resolve(process.cwd(), 'webpack.config.js');

      const launcherOptions = {
        baseUrl: `http://${getIpAddress()}:8080`,
        capabilities,
        hostname: 'localhost',
        port: 4444,
        services: [
          [TerraService, {}],
          [AssetServerService, { webpackConfig: defaultWebpackPath }],
          [VisualRegressionLauncher, {}],
          [SeleniumDockerService],
        ],
        launcherOptions: { disableSeleniumService: false },
      };

      expect(Launcher).toHaveBeenCalledWith('/example/path', launcherOptions);
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
        config: '/path', theme: 'terra-default-theme', locale: 'en',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'fr',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'en',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'fr',
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
        config: '/path', theme: 'terra-default-theme', locale: 'en', formFactor: 'tiny',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'en', formFactor: 'large',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'fr', formFactor: 'tiny',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-default-theme', locale: 'fr', formFactor: 'large',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'en', formFactor: 'tiny',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'en', formFactor: 'large',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'fr', formFactor: 'tiny',
      });
      expect(TestRunner.run).toHaveBeenCalledWith({
        config: '/path', theme: 'terra-mock-theme', locale: 'fr', formFactor: 'large',
      });
    });

    it('should initiate a test runner with custom options', async () => {
      jest.spyOn(TestRunner, 'run').mockImplementation(() => Promise.resolve());

      await TestRunner.start({
        assetServerPort: 8080,
        baseUrl: '/',
        browsers: ['chrome', 'firefox'],
        config: '/path',
        disableSeleniumService: true,
        externalHost: 'externalHost',
        externalPort: 3000,
        formFactors: ['small'],
        gridUrl: 'http',
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

      expect(TestRunner.run).toHaveBeenCalledWith({
        assetServerPort: 8080,
        baseUrl: '/',
        browsers: ['chrome', 'firefox'],
        config: '/path',
        disableSeleniumService: true,
        externalHost: 'externalHost',
        externalPort: 3000,
        formFactor: 'small',
        gridUrl: 'http',
        hostname: 'hostname',
        keepAliveSeleniumDockerService: true,
        locale: 'en',
        port: 8080,
        site: 'build',
        spec: '/spec/',
        suite: 'test-suite',
        theme: 'terra-default-theme',
        updateScreenshots: true,
      });
    });
  });
});
