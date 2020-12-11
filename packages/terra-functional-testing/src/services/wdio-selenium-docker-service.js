/* eslint-disable class-methods-use-this */
const path = require('path');
const util = require('util');
const childProcess = require('child_process');
const { SevereServiceError } = require('webdriverio');
const { Logger } = require('@cerner/terra-cli');

const logger = new Logger({ prefix: '[terra-functional-testing:wdio-selenium-docker-service]' });

const exec = util.promisify(childProcess.exec);

class SeleniumDockerService {
  constructor(options = {}) {
    const { version } = options;

    this.version = version || '3.14.0-helium';
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
      throw new SevereServiceError('Docker is not installed.');
    }

    try {
      await this.initializeSwarm();
      await this.deployStack();
    } catch (error) {
      throw new SevereServiceError(error);
    }
  }

  /**
   * Initializes a docker swarm instance.
   */
  async initializeSwarm() {
    const { stdout: dockerInfo } = await exec('docker info --format "{{json .}}"');
    const { Swarm } = JSON.parse(dockerInfo);

    if (Swarm.LocalNodeState !== 'active') {
      logger.info('Initializing docker swarm.');

      await exec('docker swarm init');
    }
  }

  /**
   * Deploys the docker stack. The previous stack will be removed if it exists.
   */
  async deployStack() {
    // Remove the previous stack if one exists.
    await this.removeStack();

    logger.info(`Deploying docker stack using selenium ${this.version}.`);

    const composeFilePath = path.resolve(__dirname, '../docker/docker-compose.yml');

    await exec(`TERRA_SELENIUM_DOCKER_VERSION=${this.version} docker stack deploy -c ${composeFilePath} wdio`);

    // Ensure the services and network have been removed.
    await this.resolveAfter10Seconds();
    await this.waitForServiceCreation();
    await this.waitForNetworkCreation();
    await this.waitForNetworkReady();
  }

  /**
   * Removes the docker stack.
   */
  async removeStack() {
    const { stdout: stackInfo } = await exec('docker stack ls | grep wdio || true');

    if (stackInfo) {
      logger.info('Removing docker stack.');

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
          logger.info('Timeout. Exceeded retry count.');
          reject(Error('Timeout. Exceeded retry count.'));
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
   * Ensures the docker network has been created.
   */
  async waitForNetworkCreation() {
    logger.info('**********waitForNetworkCreation**********');
    await this.pollCommand('docker network ls | grep wdio', (result) => (
      new Promise((resolve, reject) => {
        const { stdout: networkStatus } = result;

        if (networkStatus) {
          logger.info('**********Docker network is created**********', networkStatus);
          resolve();
        } else {
          logger.info('**********Docker network is not yet created**********', result);
          reject();
        }
      })));
  }

  /**
   * Ensures the docker services have been created.
   */
  async waitForServiceCreation() {
    logger.info('**********waitForServiceCreation**********');
    await this.pollCommand('docker service ls | grep wdio', (result) => (
      new Promise((resolve, reject) => {
        const { stdout: serviceStatus } = result;

        // Reject if there is an active service returned.
        if (serviceStatus) {
          logger.info('**********Docker services is created**********', serviceStatus);
          resolve();
        } else {
          logger.info('**********Docker services is not yet created**********', result);
          reject();
        }
      })));
  }

  /**
   * Ensures the docker network has been shut down.
   */
  async waitForNetworkRemoval() {
    logger.info('**********waitForNetworkRemoval**********');
    await this.pollCommand('docker network ls | grep wdio || true', (result) => (
      new Promise((resolve, reject) => {
        const { stdout: networkStatus } = result;

        // Reject if there is an active network returned.
        if (networkStatus) {
          logger.info('**********Docker network is not yet shutdown**********', networkStatus);
          reject();
        } else {
          logger.info('**********Docker network is shutdown**********', result);
          resolve();
        }
      })));
  }

  /**
   * Ensures the docker services have been shut down.
   */
  async waitForServiceRemoval() {
    logger.info('**********waitForServiceRemoval**********');
    await this.pollCommand('docker service ls | grep wdio || true', (result) => (
      new Promise((resolve, reject) => {
        const { stdout: serviceStatus } = result;

        // Reject if there is an active service returned.
        if (serviceStatus) {
          logger.info('**********Docker services is not yet shutdown**********', serviceStatus);
          reject();
        } else {
          logger.info('**********Docker services is shutdown**********', result);
          resolve();
        }
      })));
  }

  /**
   * Ensures the docker network is ready.
   */
  async waitForNetworkReady() {
    logger.info('Waiting for the selenium grid to become ready.');

    await this.pollCommand(`curl -sSL http://${this.host}:${this.port}/wd/hub/status`, (result) => (
      new Promise((resolve, reject) => {
        const { stdout } = result;
        const { value } = JSON.parse(stdout);

        if (value.ready) {
          logger.info('Selenium grid is ready.', value);
          resolve();
        } else {
          logger.info('Selenium grid is not ready...still waiting.');
          reject();
        }
        // A two minute timeout for the selenium service to become available.
        // This helps account for pulling the docker images for the very first time.
      })), 60, 2000);
  }

  /**
   * Removes the docker stack and network.
   */
  async onComplete() {
    await this.removeStack();

    // logger.info('**********START waiting******', new Date().getTime());
    // await this.resolveAfter10Seconds();
    // logger.info('**********END waiting******', new Date().getTime());
  }

  resolveAfter10Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }
}

module.exports = SeleniumDockerService;
