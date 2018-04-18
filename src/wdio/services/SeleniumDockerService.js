/* eslint-disable class-methods-use-this, no-console */
import { exec } from 'child_process';
import retry from 'async/retry';
import http from 'http';
import path from 'path';

const DEFAULT_COMPOSE_FILE = path.join(__dirname, '..', 'docker-compose.yml');
const DOCKER_INFO_ERROR = 'docker-within-a-docker';

/**
* Webdriver.io SeleniuMDockerService
* provides standalone chrome/firefox selenium docker automation.
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
      enabled: true, // True if service enabled, false otherwise
      retries: 2000, // Retry count to test for selenium being up
      retryInterval: 10, // Retry interval in milliseconds to wait between retries for selenium to come up.
      composeFile: DEFAULT_COMPOSE_FILE,
      ...(config.seleniumDocker || {}),
    };

    this.host = config.host;
    this.port = config.port;
    this.path = config.path;

    if (this.config.enabled) {
      // Need to activate a docker swarm if one isn't already present
      // before a docker stack can be deployed
      const dockerInfo = await this.getDockerInfo();
      console.log(dockerInfo);
      // add error catching to prevent building a docker container when within docker
      this.seleniumPossible = true;
      if (dockerInfo === DOCKER_INFO_ERROR) {
        console.log('ERROR?');
        this.seleniumPossible = false;
      }

      if (this.seleniumPossible) {
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
  }

  /**
   * Clean up docker container after all workers got shut down and the process is about to exit.
   */
  async onComplete() {
    if (this.config.enabled && this.seleniumPossible) {
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
      console.log('[SeleniumDocker] Ensuring selenium status is ready');
      retry({ times: this.config.retries, interval: this.config.retryInterval },
        this.getSeleniumStatus, (err, result) => {
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
    console.log('[SeleniumDocker] Initializing docker swarm');
    return this.execute('docker swarm init');
  }

  /**
  * Deploys the docker selenium hub stack
  * @return {Promise}
  */
  deployStack() {
    console.log('[SeleniumDocker] Deploying docker selenium stack');
    return this.execute(`docker stack deploy --compose-file ${this.config.composeFile} wdio`);
  }

  /**
  * Stops the docker stack
  * @return {Promise}
  */
  removeStack() {
    console.log('[SeleniumDocker] Removing docker selenium stack');
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
      retry({ times: 1000, interval: 10 },
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
      path: path.join(this.path || '/wd/hub', 'status'),
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
