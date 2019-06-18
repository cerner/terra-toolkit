/* eslint-disable class-methods-use-this */
import { exec } from 'child_process';
import retry from 'async/retry';
import http from 'http';
import path from 'path';
import SERVICE_DEFAULTS from '../../../config/wdio/services.default-config';
import Logger from '../../../scripts/utils/logger';

const context = '[Terra-Toolkit:selenium-docker]';
/**
* Webdriver.io SeleniumDockerService
* provides standalone chrome selenium docker automation.
*/
export default class SeleniumDockerService {
  constructor() {
    this.getSeleniumStatus = this.getSeleniumStatus.bind(this);
  }

  /**
   * Start up docker container before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  async onPrepare(config) {
    this.config = {
      ...SERVICE_DEFAULTS.seleniumDocker,
      ...(config.seleniumDocker || {}),
    };

    this.host = config.host;
    this.port = config.port;
    this.path = config.path;

    if (this.config.enabled) {
      // Need to activate a docker swarm if one isn't already present
      // before a docker stack can be deployed
      const dockerInfo = await this.getDockerInfo();
      if (dockerInfo.Swarm.LocalNodeState !== 'active') {
        await this.initSwarm();
      }

      // Always start with a fresh stack
      if (await this.getStack()) {
        await this.removeStack();
        await this.ensureNetworkRemoved();
      }

      await this.deployStack();
      await this.ensureSelenium();
    }
  }

  /**
   * Clean up docker container after all workers got shut down and the process is about to exit.
   */
  async onComplete() {
    if (this.config.enabled) {
      await this.removeStack();
      await this.ensureNetworkRemoved();
    }
  }

  /**
  * Waits for selenium to startup and be ready within the configured container.
  * @return {Promise}
  */
  ensureSelenium() {
    return new Promise((resolve, reject) => {
      Logger.log('Ensuring selenium status is ready', { context });
      retry(
        { times: this.config.retries, interval: this.config.retryInterval },
        this.getSeleniumStatus, (err, result) => {
          if (err) {
            reject(Logger.error(JSON.stringify(err), { context }));
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  /**
  * Gets the stack information.
  * @return {Promise} which resolves to a string representing the stack, or null if none exists.
  */
  getStack() {
    return new Promise((resolve) => {
      exec('docker stack ls | grep wdio', (error, stdout) => {
        resolve(stdout);
      });
    });
  }

  /**
  * Gets information about the docker environment.
  * @return {Promise} which resolves to a JSON object describing the docker environment.
  */
  getDockerInfo() {
    return this.execute('docker info --format "{{json .}}"')
      .then(result => JSON.parse(result));
  }

  /**
  * Gets the stack default network.
  * @return {Promise} which resolves to a string representing the network, or null if none exists.
  */
  getNetwork() {
    return this.execute('docker network ls --filter name=wdio  --format "{{.ID}}: {{.Driver}}"');
  }

  /**
  * Initializes the docker swarm. See https://docs.docker.com/engine/reference/commandline/swarm_init/#related-commands
  * @return {Promise}
  */
  initSwarm() {
    Logger.log('Initializing docker swarm', { context });
    return this.execute('docker swarm init');
  }

  /**
  * Deploys the docker selenium hub stack
  * @return {Promise}
  */
  deployStack() {
    Logger.log('Deploying docker selenium stack', { context });
    return this.execute(`docker stack deploy --compose-file ${this.config.composeFile} wdio`);
  }

  /**
  * Stops the docker stack
  * @return {Promise}
  */
  removeStack() {
    Logger.log('Removing docker selenium stack', { context });
    return this.execute('docker stack rm wdio');
  }

  /**
  * Executes an arbitrary command and returns a promise.
  * @param {String} command - The command to execute
  * @return {Promise}
  */
  execute(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
  * Ensures the stack default network is removed.
  * @return {Promise}
  */
  ensureNetworkRemoved() {
    return new Promise((resolve, reject) => {
      retry(
        { times: 1000, interval: 10 },
        (callback) => {
          // If there is a network, it will register as an error in the callback
          this.getNetwork().then(callback).catch(callback);
        }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  /**
  * Gets the status of the selenium server.
  * @param {function} callback taking (err, result).
  */
  getSeleniumStatus(callback) {
    http.get({
      host: this.host,
      port: this.port,
      path: path.posix.join(this.path || '/wd/hub', 'status'),
    }, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        callback('Request failed');
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const status = JSON.parse(rawData);
          if (status.value && status.value.ready) {
            callback(null, status);
          } else {
            callback(status);
          }
        } catch (e) {
          callback(`Request failed: ${e.message}`);
        }
      });
    }).on('error', (e) => {
      callback(`Request failed: ${e.message}`);
    });
  }
}
