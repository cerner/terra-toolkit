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
});
