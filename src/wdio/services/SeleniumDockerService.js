import { exec } from 'child_process';
import retry from 'async/retry';
import http from 'http';
import path from 'path';

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
  async onPrepare(config, capabilities) {
    this.config = {
      enabled: true, // True if service enabled, false otherwise
      cleanup: false, // True if docker container should be removed after test
      image: null, // The image name to use, defaults to selenium/standalone-${browser}
      retries: 1000, // Retry count to test for selenium being up
      retryInterval: 10, // Retry interval in milliseconds to wait between retries for selenium to come up.
      env: {}, // Environment variables to add to the container
      ...(config.seleniumDocker || {}),
    };
    this.host = config.host;
    this.port = config.port;
    this.path = config.path;
    this.browserName = capabilities[0].browserName;

    if (!this.config.enabled) {
      return;
    }

    this.container = await this.getRunningContainer();

    // There is a running container that doesn't match configuration, stop it
    // before proceeding
    if (this.container && this.getImage() !== this.container.image) {
      await this.stop();

    // There is a container, verify selenium is running as expected
    } else if (this.container) {
      try {
        await this.ensureSelenium();

      // Selenium isn't responding stop the container;
      } catch (e) {
        await this.stop();
      }
    }

    if (!this.container) {
      await this.pullImage();
      await this.runImage();
      await this.ensureSelenium();
    }
  }

  /**
   * Clean up docker container after all workers got shut down and the process is about to exit.
   */
  async onComplete() {
    if (this.config.cleanup && this.config.enabled) {
      await this.stop();
    }
  }

  /**
  * Waits for selenium to startup and be ready within the configured container.
  * @return {Promise}
  */
  ensureSelenium() {
    return new Promise((resolve, reject) => {
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
  * Pulls the configured docker image based on the browserName in config or
  * configured image.
  * @return {Promise}
  */
  pullImage() {
    return new Promise((resolve, reject) => {
      console.log(`Pulling latest image for ${this.getImage()}`);
      exec(`docker pull ${this.getImage()}`, (error, stdout, stderr) => {
        const fail = error || stderr;
        if (fail) {
          reject(fail);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
  * Runs the configured docker image
  * @return {Promise}
  */
  runImage() {
    let args = '';
    if (this.browserName === 'chrome') {
      args = '-v /dev/shm:/dev/shm';
    } else if (this.browserName === 'firefox') {
      args = '--shm-size 2g';
    }

    const env = Object.keys(this.config.env).map(key => `-e ${key}=${this.config.env[key]}`).join(' ');
    const command = `docker run -l wdio=${this.browserName} -d --rm ${env} ${args} -p ${this.port}:4444 ${this.getImage()}`;
    return new Promise((resolve, reject) => {
      console.log(`Running image for ${this.getImage()}`);
      exec(command, (error, stdout, stderr) => {
        const fail = error || stderr;
        if (fail) {
          reject(fail);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
  * Gets the running selenium container.
  * @return {Object} representing the active selenium container, if any.
  */
  // eslint-disable-next-line class-methods-use-this
  getRunningContainer() {
    return new Promise((resolve, reject) => {
      exec('docker ps -f "label=wdio" --format "{{.ID}} {{.Image}}"', (error, stdout) => {
        if (error) {
          reject(error);
        } else if (stdout) {
          const result = stdout.trim().split(' ');
          resolve({
            id: result[0],
            image: result[1],
          });
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get the docker image to use based on configuration and browser capabilities.
   * @return The name of the docker image to use.
   */
  getImage() {
    // Use configured image or infer image from browserName (only firefox and safari supported).
    // TODO: Eventually an entire hub should be stood up which supports all browsers in capabilities config
    return this.config.image || `selenium/standalone-${this.browserName}`;
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this.container) {
        exec(`docker stop ${this.container.id}`, (error, stdout) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
            this.container = null;
          }
        });
      } else {
        resolve();
      }
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
