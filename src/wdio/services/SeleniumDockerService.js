/* eslint-disable class-methods-use-this, no-console */
import { exec } from 'child_process';
import retry from 'async/retry';
import http from 'http';
import path from 'path';

const DEFAULT_COMPOSE_FILE = path.join(__dirname, '..', 'docker-compose.yml');

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
      if (dockerInfo.Swarm.LocalNodeState !== 'active') {
        await this.initSwarm();
      }

      // Always start with a fresh stack
      if (await this.getStack()) {
        await this.removeStack();
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

  getStack() {
    return new Promise((resolve) => {
      exec('docker stack ls | grep wdio', (error, stdout) => {
        resolve(stdout);
      });
    });
  }

  getDockerInfo() {
    return new Promise((resolve, reject) => {
      exec('docker info --format "{{json .}}"', (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(stdout));
        }
      });
    });
  }

  /**
  * Initializes the docker swarm. See https://docs.docker.com/engine/reference/commandline/swarm_init/#related-commands
  * @return {Promise}
  */
  initSwarm() {
    return new Promise((resolve, reject) => {
      console.log('[SeleniumDocker] Initializing docker swarm');
      exec('docker swarm init', (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
  * Deploys the docker selenium hub stack
  * @return {Promise}
  */
  deployStack() {
    const command = `docker stack deploy --compose-file ${this.config.composeFile} wdio`;
    return new Promise((resolve, reject) => {
      console.log('[SeleniumDocker] Deploying docker selenium stack');
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
  * Stops the docker stack
  * @return {Promise}
  */
  removeStack() {
    return new Promise((resolve, reject) => {
      console.log('[SeleniumDocker] Removing docker selenium stack');
      exec('docker stack rm wdio', (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
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
