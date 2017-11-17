import { exec } from 'child_process';
import retry from 'async/retry';
import http from 'http';
import path from 'path';
import os from 'os';

const DEFAULT_COMPOSE_FILE = path.join(__dirname, '..', 'selenium-grid.yml');
const DEFAULT_INSTANCES = {
  chrome: os.cpus().length,
};

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
    // If a custom compose file is provided, dont' default instances as we don't
    // know the service names.
    let instances = DEFAULT_INSTANCES;
    const customComposeFile = (config.seleniumDocker || {}).composeFile;
    if (customComposeFile && customComposeFile !== DEFAULT_COMPOSE_FILE) {
      instances = {};
    }

    this.config = {
      enabled: true, // True if service enabled, false otherwise
      retries: 2000, // Retry count to test for selenium being up
      retryInterval: 10, // Retry interval in milliseconds to wait between retries for selenium to come up.
      composeFile: DEFAULT_COMPOSE_FILE,
      instances,
      ...(config.seleniumDocker || {}),
    };
    this.host = config.host;
    this.port = config.port;
    this.path = config.path;


    if (!this.container) {
      await this.startHub();
      await this.ensureSelenium();
    }
  }

  /**
   * Clean up docker container after all workers got shut down and the process is about to exit.
   */
  async onComplete() {
    if (this.config.enabled) {
      await this.stop();
    }
  }

  /**
  * Waits for selenium to startup and be ready within the configured container.
  * @return {Promise}
  */
  ensureSelenium() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-console
      console.log('Ensuring selenium status is ready');
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
  * Runs the configured docker image
  * @return {Promise}
  */
  startHub() {
    const scale = Object.keys(this.config.instances).map(key => `--scale ${key}=${this.config.instances[key]}`).join(' ');
    const command = `docker-compose -f ${this.config.composeFile} up -d ${scale}`;

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-console
      console.log('Starting selenium hub');
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }


  stop() {
    return new Promise((resolve, reject) => {
      exec(`docker-compose -f ${this.config.composeFile} down`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
          this.container = null;
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
