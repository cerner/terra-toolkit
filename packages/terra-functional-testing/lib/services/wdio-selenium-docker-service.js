/* eslint-disable class-methods-use-this */
const path = require('path');
const util = require('util');
const childProcess = require('child_process');
const Logger = require('../logger/logger');

const exec = util.promisify(childProcess.exec);
const logger = new Logger({ prefix: 'wdio-selenium-docker-service' });

class SeleniumDockerService {
  constructor(options = {}) {
    const { version } = options;

    this.version = version || '3.141.59-20200525';
  }

  /**
   * Prepares the docker testing environment.
   */
  async onPrepare(config) {
    this.host = config.hostname;
    this.port = config.port;

    // Verify docker is installed before proceeding.
    try {
      await exec('docker -v');
    } catch (error) {
      logger.error('Docker is not installed. Install docker to continue.');
      throw error;
    }

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
   * Deploys the docker stack. The previous stack will be removed if it exists.
   */
  async deployStack() {
    // Remove the previous stack if one exists.
    await this.removeStack();

    logger.log(`Deploying docker stack using selenium ${this.version}.`);

    const composeFilePath = path.resolve(__dirname, '../docker/docker-compose.yml');

    await exec(`TERRA_SELENIUM_DOCKER_VERSION=${this.version} docker stack deploy -c ${composeFilePath} wdio`);

    await this.waitForNetworkReady();
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
      await this.waitForServiceRemoval();
      await this.waitForNetworkRemoval();
    }
  }

  /**
   * Waits for a command to complete successfully.
   * @param {string} command - The shell command to run.
   * @param {func} callback - A callback function to accept or reject the result of the command. Must return a promise.
   * @param {number} retries - The number of times to retry the command. Defaults to 30 retries.
   * @param {number} interval - The timeout between commands in milliseconds. Defaults to every two seconds.
   * @returns {Promise} - A promise that resolves when the callback accepts the command response.
   */
  async pollCommand(command, callback, retries = 30, interval = 2000) {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      let pollTimeout = null;

      const poll = async () => {
        if (retryCount >= retries) {
          clearTimeout(pollTimeout);
          pollTimeout = null;
          reject(Error(logger.format('Timeout. Exceeded retry count.')));
        }

        try {
          const result = await exec(command);

          await callback(result).then(() => resolve());
        } catch (error) {
          retryCount += 1;
          pollTimeout = setTimeout(poll, interval);
        }
      };

      pollTimeout = setTimeout(poll, interval);
    });
  }

  /**
   * Ensures the docker network has been shut down.
   */
  async waitForNetworkRemoval() {
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
  async waitForServiceRemoval() {
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
  async waitForNetworkReady() {
    logger.log('Waiting for the selenium grid to become ready.');

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

module.exports = SeleniumDockerService;
