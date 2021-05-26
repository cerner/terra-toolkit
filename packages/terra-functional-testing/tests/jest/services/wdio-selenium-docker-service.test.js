jest.mock('util');
jest.mock('@cerner/terra-cli');

const util = require('util');
const path = require('path');

// The util promisify mock needs to be defined before the docker service import.
const mockExec = jest.fn();
util.promisify.mockImplementation(() => mockExec);

const config = {
  launcherOptions: {
    disableSeleniumService: true,
    keepAliveSeleniumDockerService: true,
  },
  serviceOptions: {
    seleniumVersion: '1234',
  },
};

const SeleniumDockerService = require('../../../src/services/wdio-selenium-docker-service');

describe('WDIO Selenium Docker Service', () => {
  describe('constructor', () => {
    it('should initialize with empty config', async () => {
      const service = new SeleniumDockerService();

      expect(service.disableSeleniumService).toBe(false);
      expect(service.keepAliveSeleniumDockerService).toBe(false);
    });

    it('should initialize with populated config', async () => {
      const service = new SeleniumDockerService({}, {}, config);

      expect(service.disableSeleniumService).toBe(true);
      expect(service.keepAliveSeleniumDockerService).toBe(true);
      expect(service.seleniumVersion).toEqual('1234');
    });
  });

  describe('onPrepare', () => {
    it('should verify docker is installed before proceeding', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve());

      jest.spyOn(service, 'startSeleniumHub').mockImplementationOnce(() => Promise.resolve());

      await service.onPrepare({});

      expect(mockExec).toHaveBeenCalledWith('docker -v');
    });

    it('should throw an error if docker is not installed', async () => {
      const service = new SeleniumDockerService();
      const mockError = Error('Docker is not installed.');

      mockExec.mockImplementation(() => Promise.reject(mockError));

      try {
        await service.onPrepare({});
      } catch (error) {
        expect(error.message).toEqual('Error: Docker is not installed.');
      }

      expect.assertions(1);
    });

    it('should throw a SevereServiceError if the selenium hub fails to start', async () => {
      const service = new SeleniumDockerService();

      const mockError = Error('Mock Error.');
      mockExec.mockImplementation(() => Promise.resolve());

      jest.spyOn(service, 'startSeleniumHub').mockImplementationOnce(() => Promise.reject(mockError));

      try {
        await service.onPrepare({});
      } catch (error) {
        expect(error.name).toEqual('SevereServiceError');
      }

      expect.assertions(1);
    });

    it('should not start selenium hub if the service should be disabled', async () => {
      const service = new SeleniumDockerService({}, {}, config);

      mockExec.mockImplementation(() => Promise.resolve());

      await service.onPrepare();

      expect(mockExec).not.toHaveBeenCalled();
    });
  });

  describe('pollCommand', () => {
    it('should invoke the command and callback', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve('mock output'));

      const mockCallback = jest.fn().mockImplementation(() => Promise.resolve());

      await service.pollCommand('mock command', mockCallback);

      expect(mockExec).toHaveBeenCalledWith('mock command');
      expect(mockCallback).toHaveBeenCalledWith('mock output');
    });

    it('should timeout if the retry count is exceeded', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve());

      const mockCallback = jest.fn().mockImplementation(() => Promise.reject());

      try {
        // Retry 3 times. Repeat every 10 milliseconds.
        await service.pollCommand('mock command', mockCallback, 2, 10);
      } catch (error) {
        expect(mockCallback).toHaveBeenCalledTimes(3);
      }
    });
  });

  describe('getDockerComposeFilePath', () => {
    it('should return the docker compose file path', () => {
      const composeFilePath = path.resolve(__dirname, '../../../src/docker/docker-compose.yml');

      const service = new SeleniumDockerService();

      expect(service.getDockerComposeFilePath()).toEqual(composeFilePath);
    });
  });

  describe('startSeleniumHub', () => {
    it('should start the selenium hub', () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'getDockerComposeFilePath').mockImplementationOnce(() => ('mock-compose-path'));
      jest.spyOn(service, 'waitForSeleniumHubReady').mockImplementationOnce(() => Promise.resolve());

      service.startSeleniumHub();

      expect(mockExec).toHaveBeenCalledWith('docker-compose -f mock-compose-path up -d');
    });

    it('should start the selenium hub with the specified version', () => {
      const service = new SeleniumDockerService({}, {}, config);

      jest.spyOn(service, 'getDockerComposeFilePath').mockImplementationOnce(() => ('mock-compose-path'));
      jest.spyOn(service, 'waitForSeleniumHubReady').mockImplementationOnce(() => Promise.resolve());

      service.startSeleniumHub();

      expect(mockExec).toHaveBeenCalledWith('TERRA_SELENIUM_DOCKER_VERSION=1234 docker-compose -f mock-compose-path up -d');
    });
  });

  describe('waitForSeleniumHubReady', () => {
    it('should wait until the selenium hub is ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.waitForSeleniumHubReady();

      // The host and port are undefined for this test.
      expect(service.pollCommand).toHaveBeenCalledWith('docker inspect --format="{{json .State.Health.Status}}" selenium-hub', expect.any(Function), 60, 2000);
    });

    it('should reject the command if the selenium hub is not ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: 'unhealthy' })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForSeleniumHubReady();

      expect.assertions(1);
    });

    it('should resolve the command if the selenium hub is ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: '"healthy"' })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForSeleniumHubReady();

      expect.assertions(1);
    });
  });

  describe('onComplete', () => {
    it('should keep the docker hub active if the keep alive option has been set to true', async () => {
      const service = new SeleniumDockerService();
      service.keepAliveSeleniumDockerService = true;

      await service.onComplete();

      expect(mockExec).not.toHaveBeenCalled();
    });

    it('should not compose down the selenium hub if the service was disabled', async () => {
      const service = new SeleniumDockerService();
      service.disableSeleniumService = true;

      await service.onComplete();

      expect(mockExec).not.toHaveBeenCalled();
    });

    it('should compose down the selenium hub', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'getDockerComposeFilePath').mockImplementationOnce(() => ('mock-compose-path'));

      await service.onComplete();

      expect(mockExec).toHaveBeenCalledWith('docker-compose -f mock-compose-path down');
    });
  });
});
