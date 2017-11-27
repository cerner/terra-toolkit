### WebpackDevServer Service
WebpackDevServer Service is provided as a convenience to start a webpack-dev-server and return a promise when the webpack compiler is complete. This enables test setup to be complete before testing is began. This service is utilized by the the default nightwatch configuration and must be provided as a service to webdriver.io if the webpack-dev-server is used to host your test pages.

#### Options

In the wdio.conf.js you can pass a configuration object with the following structure:

* **webpackConfig** - the webpack configuration used to start the webpack-dev-server. Must be provided to use this service.
* **webpackPort** - the port to start the webpack-dev-server on. Defaults to port 8080.
* **webpackDevServerConfig** - the webpack-dev-server configuration to be passed to the webpack-dev-server. Defaults to { quiet: true, hot: false, inline: false }.


#### Example
```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const webpackConfig = require('./webpack.config.js');
const WebpackDevService = require('terra-toolkit/wdio/services/index').WebpackDevService;
const localIP = require('ip');

const port = 8080;

const config = {
  ...wdioConf.config,

  // Point base URL at the site to be tested
  baseUrl: `http://${localIP.address()}:${port}`,

  // Configuration for WebpackDev service
  webpackConfig,
  webpackPort: port,

  service = wdioConf.config.services.concat([WebpackDevService]);
};

exports.config = config;
```
