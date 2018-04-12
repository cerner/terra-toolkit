# Terra Toolkit serve-static Service
Terra Toolkit serve-static Service is provided as a convenience to start an express server and return a promise when the webpack compiler is complete. This enables test setup to be complete before testing is began. This service must be provided as a service to webdriver.io to host your test pages.

## Options

| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **webpackConfig**  | true | `undefined` | The webpack configuration used to start the express server. |
| **serveStatic**  | false | `{ index: 'index.html', port: '8080' }` | The webpack-dev-server configuration to be passed to the webpack-dev-server. |

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const webpackConfig = require('./webpack.config.js');
const TerraToolkitServeStaticService = require('terra-toolkit/wdio/services/index').TerraToolkitServeStaticService;
const localIP = require('ip');

const port = 8080;

const config = {
  ...wdioConf.config,

  // Point base URL at the site to be tested for correct webdriver.io setup
  baseUrl: `http://${localIP.address()}:${port}`,

  // Configuration for WebpackDev service
  webpackConfig,
  serveStatic: {
    port,
  },

  service = wdioConf.config.services.concat([TerraToolkitServeStaticService]);
};

exports.config = config;
```
