# Selenium Docker Service
Selenium docker is provided as a convenience to make selenium testing easier and more stable. Running selenium in a container ensures a consistent testing environment across testing environments which is critical for visual regression testing.

## Options

Under the key `seleniumDocker` in the wdio.conf.js one can pass a configuration object with the following structure:

* **enabled** - Flag to disable selenium docker; useful for CI environments which can startup the docker instance outside of test runs. Defaults to true.
* **cleanup** - Destroy the docker container after the test run. Defaults to false.
* **image** - The docker image to use for test runs. Defaults to `selenium/standalone-chrome` or `selenium/standalone-firefox` based on browser capabilities specified in config.
* **retries** - Retry count to test for selenium being up. Default 1000.
* **retryInterval** - Retry interval in milliseconds to wait between retries for selenium to come up. Default 10.
* **env** - An Object representing environment variables to set within the docker instance. Defaults to {}.

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const localIP = require('ip');

const port = 8080;

const config = {
  ...wdioConf.config,

  // Point base URL at the site to be tested for correct webdriver.io setup
  baseUrl: `http://${localIP.address()}:${port}`,

  // Configuration for SeleniumDocker service
  seleniumDocker: {
    // Disable if running in Travis
    enabled: !process.env.TRAVIS,
    env: {
      TZ: 'America/Chicago'
    },
  },
};

exports.config = config;
```
