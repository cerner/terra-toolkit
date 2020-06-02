jest.mock('util');
jest.mock('../../../lib/logger/logger');

const util = require('util');
const path = require('path');

// The util promisify mock needs to be defined before the docker service import.
const mockExec = jest.fn();
util.promisify.mockImplementation(() => mockExec);

const DockerService = require('../../../lib/services/wdio-docker-service');

describe('WDIO Docker Servoce', () => {
  describe('onPrepare', () => {
    it('should initialize the docker swarm', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'initializeSwarm').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'deployStack').mockImplementationOnce(() => Promise.resolve());

      await service.onPrepare({});

      expect(service.initializeSwarm).toHaveBeenCalled();
    });

    it('should deploy the docker stack', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'initializeSwarm').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'deployStack').mockImplementationOnce(() => Promise.resolve());

      await service.onPrepare({});

      expect(service.deployStack).toHaveBeenCalled();
    });
  });

  describe('initializeSwarm', () => {
    it('should initialize the docker swarm if not already active', async () => {
      const service = new DockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: JSON.stringify({ Swarm: { LocalNodeState: 'inactive' } }) }));

      await service.initializeSwarm();

      expect(mockExec).toHaveBeenCalledWith('docker info --format "{{json .}}"');
      expect(mockExec).toHaveBeenCalledWith('docker swarm init');
    });

    it('should not initialize the docker swarm if already active', async () => {
      const service = new DockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: JSON.stringify({ Swarm: { LocalNodeState: 'active' } }) }));

      await service.initializeSwarm();

      expect(mockExec).toHaveBeenCalledWith('docker info --format "{{json .}}"');
      expect(mockExec).toHaveBeenCalledTimes(1);
    });
  });

  describe('deployStack', () => {
    it('should deploy the stack', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'awaitNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      const composeFilePath = path.resolve(__dirname, '../../../lib/docker/docker-compose.yml');

      expect(mockExec).toHaveBeenCalledWith(`docker stack deploy -c ${composeFilePath} wdio`);
    });

    it('should remove the previous network stack', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'awaitNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      expect(service.removeStack).toHaveBeenCalled();
    });

    it('should wait for the network to become ready', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'awaitNetworkReady').mockImplementationOnce(() => Promise.resolve());

      await service.deployStack();

      expect(service.awaitNetworkReady).toHaveBeenCalled();
    });
  });

  describe('removeStack', () => {
    it('should not execute the docker stack removal if it is already removed', async () => {
      const service = new DockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: '' }));

      await service.removeStack();

      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith('docker stack ls | grep wdio || true');
    });

    it('should remove the docker stack', async () => {
      const service = new DockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: 'Active' }));

      jest.spyOn(service, 'awaitServiceRemoval').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'awaitNetworkRemoval').mockImplementationOnce(() => Promise.resolve());

      await service.removeStack();

      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenCalledWith('docker stack rm wdio');
    });

    it('should wait for the network and service to be removed', async () => {
      const service = new DockerService();

      mockExec.mockImplementation(() => Promise.resolve({ stdout: 'Active' }));

      jest.spyOn(service, 'awaitServiceRemoval').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(service, 'awaitNetworkRemoval').mockImplementationOnce(() => Promise.resolve());

      await service.removeStack();

      expect(service.awaitServiceRemoval).toHaveBeenCalled();
      expect(service.awaitNetworkRemoval).toHaveBeenCalled();
    });
  });

  describe('pollCommand', () => {
    it('should invoke the command and callback', async () => {
      const service = new DockerService();

      mockExec.mockImplementation(() => Promise.resolve('mock output'));

      const mockCallback = jest.fn().mockImplementation(() => Promise.resolve());

      await service.pollCommand('mock command', mockCallback);

      expect(mockExec).toHaveBeenCalledWith('mock command');
      expect(mockCallback).toHaveBeenCalledWith('mock output');
    });

    it('should timeout if the retry count is exceeded', async () => {
      const service = new DockerService();

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

  describe('awaitNetworkRemoval', () => {
    it('should wait until the network has been removed', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.awaitNetworkRemoval();

      expect(service.pollCommand).toHaveBeenCalledWith('docker network ls | grep wdio || true', expect.any(Function));
    });

    it('should reject the command if the network status is present', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: 'Active Network' })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.awaitNetworkRemoval();

      expect.assertions(1);
    });

    it('should resolve the command if the network has been removed', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: '' })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.awaitNetworkRemoval();

      expect.assertions(1);
    });
  });

  describe('awaitServiceRemoval', () => {
    it('should wait until the service has been removed', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.awaitServiceRemoval();

      expect(service.pollCommand).toHaveBeenCalledWith('docker service ls | grep wdio || true', expect.any(Function));
    });

    it('should reject the command if the service is active', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: 'Active Service' })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.awaitServiceRemoval();

      expect.assertions(1);
    });

    it('should resolve the command if the service has been removed', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: '' })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.awaitServiceRemoval();

      expect.assertions(1);
    });
  });

  describe('awaitNetworkReady', () => {
    it('should wait until the service is ready', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(() => Promise.resolve());

      await service.awaitNetworkReady();

      // The host and port are undefined for this test.
      expect(service.pollCommand).toHaveBeenCalledWith('curl -sSL http://undefined:undefined/wd/hub/status', expect.any(Function));
    });

    it('should reject the command if the network is not ready', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: JSON.stringify({ value: { ready: false } }) })).rejects.toBeUndefined();

        return Promise.resolve();
      });

      await service.awaitNetworkReady();

      expect.assertions(1);
    });

    it('should resolve the command if the network is ready', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'pollCommand').mockImplementationOnce(async (_command, callback) => {
        await expect(callback({ stdout: JSON.stringify({ value: { ready: true } }) })).resolves.toBeUndefined();

        return Promise.resolve();
      });

      await service.awaitNetworkReady();

      expect.assertions(1);
    });
  });

  describe('onComplete', () => {
    it('should remove the docker stack', async () => {
      const service = new DockerService();

      jest.spyOn(service, 'removeStack').mockImplementationOnce(() => Promise.resolve());

      await service.onComplete();

      expect(service.removeStack).toHaveBeenCalled();
    });
  });
});
