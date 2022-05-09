jest.mock('@cerner/terra-cli/lib/utils/Logger');
jest.mock('../../../../src/commands/utils/cleanScreenshots');

const fs = require('fs');
const path = require('path');
const Launcher = require('@wdio/cli').default;
const TestRunner = require('../../../../src/terra-cli/wdio/test-runner');
const getConfigurationOptions = require('../../../../src/config/utils/getConfigurationOptions');
const cleanScreenshots = require('../../../../src/commands/utils/cleanScreenshots');

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

      const options = {
        assetServerPort: 8080,
        browsers: ['chrome'],
        config: '/path',
        disableSeleniumService: true,
        externalHost: 'externalHost',
        externalPort: 3000,
        formFactor: 'small',
        gridUrl: 'http',
        keepAliveSeleniumDockerService: true,
        locale: 'en',
        site: 'build',
        spec: '/spec/',
        suite: 'test-suite',
        theme: 'terra-default-theme',
        updateScreenshots: true,
        useRemoteReferenceScreenshots: true,
        useSeleniumStandaloneService: true,
      };

      await TestRunner.run(options);

      expect(Launcher).toHaveBeenCalledWith('/example/path', getConfigurationOptions(options));
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

      const options = { config: '/path', locales: ['en', 'fr'], themes: ['terra-default-theme', 'terra-mock-theme'] };
      await TestRunner.start(options);

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
      expect(cleanScreenshots).toHaveBeenCalled();
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
        browsers: ['chrome', 'firefox'],
        config: '/path',
        disableSeleniumService: true,
        externalHost: 'externalHost',
        externalPort: 3000,
        formFactors: ['small'],
        gridUrl: 'http',
        keepAliveSeleniumDockerService: true,
        locales: ['en'],
        site: 'build',
        spec: '/spec/',
        suite: 'test-suite',
        themes: ['terra-default-theme'],
        updateScreenshots: true,
        useRemoteReferenceScreenshots: true,
        useSeleniumStandaloneService: true,
      });

      expect(TestRunner.run).toHaveBeenCalledWith({
        assetServerPort: 8080,
        browsers: ['chrome', 'firefox'],
        config: '/path',
        disableSeleniumService: true,
        externalHost: 'externalHost',
        externalPort: 3000,
        formFactor: 'small',
        gridUrl: 'http',
        keepAliveSeleniumDockerService: true,
        locale: 'en',
        site: 'build',
        spec: '/spec/',
        suite: 'test-suite',
        theme: 'terra-default-theme',
        updateScreenshots: true,
        useRemoteReferenceScreenshots: true,
        useSeleniumStandaloneService: true,
      });
    });
  });
});
