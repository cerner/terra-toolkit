jest.mock('util');
jest.mock('../../../lib/logger/logger');

const util = require('util');
const path = require('path');

// The util promisify mock needs to be defined before the docker service import.
const mockExec = jest.fn();
util.promisify.mockImplementation(() => mockExec);

const SeleniumDockerService = require('../../../lib/services/wdio-selenium-docker-service');

describe('WDIO Selenium Docker Service', () => {
  describe('onPrepare', () => {
    it('should initialize the docker swarm', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'initializeSwarm').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'deployStack').mockImplementationOnce(() => Promise.resolve());

      await service.onPrepare({});

      expect(service.initializeSwarm).toHaveBeenCalled();
    });

    it('should deploy the docker stack', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'initializeSwarm').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'deployStack').mockImplementationOnce(() => Promise.resolve());

      await service.onPrepare({});

      expect(service.deployStack).toHaveBeenCalled();
    });

    it('should verify docker is installed before proceeding', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve());

      jest.spyOn(service, 'initializeSwarm').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'deployStack').mockImplementationOnce(() => Promise.resolve());

      await service.onPrepare({});

      expect(mockExec).toHaveBeenCalledWith('docker -v');
    });

    it('should throw an error if docker is not installed', async () => {
      const service = new SeleniumDockerService();
      const mockError = Error('Mock Error');

      mockExec.mockImplementation(() => Promise.reject(mockError));

      try {
        await service.onPrepare({});
      } catch (error) {
        expect(error).toEqual(mockError);
      }

      expect.assertions(1);
    });
  });

  describe('initializeSwarm', () => {
    it('should initialize the docker swarm if not already active', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: JSON.stringify({ Swarm: { LocalNodeState: 'inactive' } }) }));

      await service.initializeSwarm();

      expect(mockExec).toHaveBeenCalledWith('docker info --format "{{json .}}"');
      expect(mockExec).toHaveBeenCalledWith('docker swarm init');
    });

    it('should not initialize the docker swarm if already active', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: JSON.stringify({ Swarm: { LocalNodeState: 'active' } }) }));

      await service.initializeSwarm();

      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith('docker info --format "{{json .}}"');
      expect(mockExec).not.toHaveBeenCalledWith('docker swarm init');
    });
  });

  describe('deployStack', () => {
    it('should deploy the stack', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'waitForNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      const composeFilePath = path.resolve(__dirname, '../../../lib/docker/docker-compose.yml');

      expect(mockExec).toHaveBeenCalledWith(`TERRA_SELENIUM_DOCKER_VERSION=3.141.59-20200525 docker stack deploy -c ${composeFilePath} wdio`);
    });

    it('should deploy the stack with the specified selenium version', async () => {
      const service = new SeleniumDockerService({ version: 'custom-version' });

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'waitForNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      const composeFilePath = path.resolve(__dirname, '../../../lib/docker/docker-compose.yml');

      expect(mockExec).toHaveBeenCalledWith(`TERRA_SELENIUM_DOCKER_VERSION=custom-version docker stack deploy -c ${composeFilePath} wdio`);
    });

    it('should remove the previous network stack', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'waitForNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      expect(service.removeStack).toHaveBeenCalled();
    });

    it('should wait for the network to become ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'waitForNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      expect(service.waitForNetworkReady).toHaveBeenCalled();
    });
  });

  describe('removeStack', () => {
    it('should not execute the docker stack removal if it is already removed', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: '' }));

      await service.removeStack();

      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExec).not.toHaveBeenCalledWith('docker stack rm wdio');
      expect(mockExec).toHaveBeenCalledWith('docker stack ls | grep wdio || true');
    });

    it('should remove the docker stack', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: 'Active' }));

      jest.spyOn(service, 'waitForServiceRemoval').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'waitForNetworkRemoval').mockImplementationOnce(() => Promise.resolve());

      await service.removeStack();

      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenCalledWith('docker stack rm wdio');
    });

    it('should wait for the network and service to be removed', async () => {
      const service = new SeleniumDockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: 'Active' }));

      jest.spyOn(service, 'waitForServiceRemoval').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'waitForNetworkRemoval').mockImplementationOnce(() => Promise.resolve());

      await service.removeStack();

      expect(service.waitForServiceRemoval).toHaveBeenCalled();
      expect(service.waitForNetworkRemoval).toHaveBeenCalled();
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
        await service.pollCommand('mock command', mockCallback, 3, 10);
      } catch (error) {
        expect(mockCallback).toHaveBeenCalledTimes(3);
      }
    });
  });

  describe('waitForNetworkRemoval', () => {
    it('should wait until the network has been removed', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.waitForNetworkRemoval();

      expect(service.pollCommand).toHaveBeenCalledWith('docker network ls | grep wdio || true', expect.any(Function));
    });

    it('should reject the command if the network status is present', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: 'Active Network' })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForNetworkRemoval();

      expect.assertions(1);
    });

    it('should resolve the command if the network has been removed', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: '' })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForNetworkRemoval();

      expect.assertions(1);
    });
  });

  describe('waitForServiceRemoval', () => {
    it('should wait until the service has been removed', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.waitForServiceRemoval();

      expect(service.pollCommand).toHaveBeenCalledWith('docker service ls | grep wdio || true', expect.any(Function));
    });

    it('should reject the command if the service is active', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: 'Active Service' })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForServiceRemoval();

      expect.assertions(1);
    });

    it('should resolve the command if the service has been removed', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: '' })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForServiceRemoval();

      expect.assertions(1);
    });
  });

  describe('waitForNetworkReady', () => {
    it('should wait until the service is ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.waitForNetworkReady();

      // The host and port are undefined for this test.
      expect(service.pollCommand).toHaveBeenCalledWith('curl -sSL http://undefined:undefined/wd/hub/status', expect.any(Function));
    });

    it('should reject the command if the network is not ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: JSON.stringify({ value: { ready: false } }) })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForNetworkReady();

      expect.assertions(1);
    });

    it('should resolve the command if the network is ready', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: JSON.stringify({ value: { ready: true } }) })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.waitForNetworkReady();

      expect.assertions(1);
    });
  });

  describe('onComplete', () => {
    it('should remove the docker stack', async () => {
      const service = new SeleniumDockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());

      await service.onComplete();

      expect(service.removeStack).toHaveBeenCalled();
    });
  });
});
