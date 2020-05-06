const fs = require('fs');
const path = require('path');
const TestRunner = require('../../../lib/test-runner/test-runner');

jest.mock('@wdio/cli', () => ({
  default: jest.fn().mockImplementation(() => ({ run: () => Promise.resolve('mock-status-code') })),
}));

describe('Test Runner', () => {
  describe('run', () => {
    it('should run the wdio cli launcher', async () => {
      jest.spyOn(TestRunner, 'configPath').mockImplementationOnce(() => '/example/path');
      jest.spyOn(process, 'exit').mockImplementationOnce(() => { });

      await TestRunner.run({ config: '/config/path' });

      expect(TestRunner.configPath).toHaveBeenCalledWith('/config/path');
      expect(process.exit).toHaveBeenCalledWith('mock-status-code');
    });

    it('should catch errors that occur trying to launch the runner', async () => {
      const mockError = Error('Mock Error');

      jest.spyOn(TestRunner, 'configPath').mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(console, 'error').mockImplementationOnce(() => { });
      jest.spyOn(process, 'exit').mockImplementationOnce(() => { });

      await TestRunner.run({ config: '/config/path' });

      expect(TestRunner.configPath).toHaveBeenCalledWith('/config/path');
      expect(console.error).toHaveBeenCalledWith('Launcher failed to start the test.\n', mockError);
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
      const expectedPath = path.resolve(__dirname, '../../../lib/test-runner/wdio.conf.js');

      expect(configPath).toEqual(expectedPath);
      expect(process.cwd).toHaveBeenCalled();
      expect(path.resolve).toHaveBeenCalledWith('/cwd', 'wdio.conf.js');
      expect(fs.existsSync).toHaveBeenCalledWith('/cwd/wdio.conf.js');
    });
  });
});
