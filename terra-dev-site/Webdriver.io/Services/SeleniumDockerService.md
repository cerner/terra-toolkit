# Selenium Docker Service
Selenium docker is provided as a convenience to make selenium testing easier and more stable. Running selenium in a container ensures a consistent testing environment across testing environments which is critical for visual regression testing.

**Requires Docker v17 or higher.**

## Options

Under the key `seleniumDocker` in the wdio.conf.js one can pass a configuration object with the following structure:

* **composeFile** - The docker compose file to use to standup the hub. Defaults to a compose file with 5 chrome instances on port http://localhost:4444/wd/hub.
* **enabled** - Flag to disable selenium docker; useful for CI environments which can startup the docker instance outside of test runs. Defaults to true.
* **retries** - Retry count to test for selenium being up. Default 1000.
* **retryInterval** - Retry interval in milliseconds to wait between retries for selenium to come up. Default 10.

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/config/wdio/wdio.config');

const config = {
  ...wdioConf.config,

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
