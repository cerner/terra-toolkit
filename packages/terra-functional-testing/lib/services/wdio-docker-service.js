/* eslint-disable class-methods-use-this */
const path = require('path');
const util = require('util');
const childProcess = require('child_process');
const Logger = require('../logger/logger');

const exec = util.promisify(childProcess.exec);
const logger = new Logger({ prefix: 'wdio-docker-service' });

const RETRY_COUNT = 30;
const POLL_INTERVAL = 2000;

class DockerService {
  /**
   * Prepares the docker testing environment.
   */
  async onPrepare(config) {
    this.host = config.hostname;
    this.port = config.port;

    await this.initializeSwarm();
    await this.deployStack();
  }

  /**
   * Initializes a docker swarm instance.
   */
  async initializeSwarm() {
    const { stdout: dockerInfo } = await exec('docker info --format "{{json .}}"');
    const { Swarm } = JSON.parse(dockerInfo);

    if (Swarm.LocalNodeState !== 'active') {
      logger.log('Initializing docker swarm.');

      await exec('docker swarm init');
    }
  }

  /**
   * Deploys the docker stack.
   */
  async deployStack() {
    // Remove the previous stack if one exists.
    await this.removeStack();

    logger.log('Deploying docker stack.');

    const composeFilePath = path.resolve(__dirname, '../docker/docker-compose.yml');

    await exec(`docker stack deploy -c ${composeFilePath} wdio`);

    await this.awaitNetworkReady();
  }

  /**
   * Removes the docker stack.
   */
  async removeStack() {
    const { stdout: stackInfo } = await exec('docker stack ls | grep wdio || true');

    if (stackInfo) {
      logger.log('Removing docker stack.');

      await exec('docker stack rm wdio');

      // Ensure the services and network have been removed.
      await this.awaitServiceRemoval();
      await this.awaitNetworkRemoval();
    }
  }

  /**
   * Waits for a command to complete successfully.
   * @param {string} command - The shell command to run.
   * @param {func} callback - A callback function to accept or reject the result of the command. Must return a promise.
   * @returns {Promise} - A promise that resolves when the callback accepts the command response.
   */
  async pollCommand(command, callback) {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      let pollTimeout = null;

      const poll = async () => {
        if (retryCount >= RETRY_COUNT) {
          clearTimeout(pollTimeout);
          pollTimeout = null;
          reject(Error(logger.format('Timeout. Exceeded retry count.')));
        }

        try {
          const result = await exec(command);

          await callback(result).then(() => resolve());
        } catch (error) {
          retryCount += 1;
          pollTimeout = setTimeout(poll, POLL_INTERVAL);
        }
      };

      pollTimeout = setTimeout(poll, POLL_INTERVAL);
    });
  }

  /**
   * Ensures the docker network has been shut down.
   */
  async awaitNetworkRemoval() {
    await this.pollCommand('docker network ls | grep wdio || true', (result) => (
      new Promise((resolve, reject) => {
        const { stdout: networkStatus } = result;

        // Reject if there is an active network returned.
        if (networkStatus) {
          reject();
        } else {
          resolve();
        }
      })));
  }

  /**
   * Ensures the docker services have been shut down.
   */
  async awaitServiceRemoval() {
    await this.pollCommand('docker service ls | grep wdio || true', (result) => (
      new Promise((resolve, reject) => {
        const { stdout: serviceStatus } = result;

        // Reject if there is an active service returned.
        if (serviceStatus) {
          reject();
        } else {
          resolve();
        }
      })));
  }

  /**
   * Ensures the docker network is ready.
   */
  async awaitNetworkReady() {
    logger.log('Waiting for docker to become ready.');

    await this.pollCommand(`curl -sSL http://${this.host}:${this.port}/wd/hub/status`, (result) => (
      new Promise((resolve, reject) => {
        const { stdout } = result;
        const { value } = JSON.parse(stdout);

        if (value.ready) {
          resolve();
        } else {
          reject();
        }
      })));
  }

  /**
   * Removes the docker stack and network.
   */
  async onComplete() {
    await this.removeStack();
  }
}

module.exports = DockerService;
