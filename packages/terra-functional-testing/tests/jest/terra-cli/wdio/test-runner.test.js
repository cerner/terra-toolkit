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
});
