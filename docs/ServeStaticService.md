# Serve-static Service
Serve-static Service is provided as a convenience to start an express server and return a promise when the webpack compiler is complete. This enables test setup to be complete before testing is began. This service must be provided as a service to webdriver.io to host your test pages.

## Options

| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **webpackConfig**  | true | `undefined` | The webpack configuration used to start the express server. |
| **site**  | false | `undefined` | The relative path to the static site used to start the express server. This takes precidence over webpack config if both are passed. |
| **serveStatic**  | false | `{ index: 'index.html', port: '8080' }` | The serveStatic configuration to be passed to the service. The only options are index and port. |

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/config/wdio/wdio.config');
const webpackConfig = require('./webpack.config.js');

const port = 8080;

const config = {
  ...wdioConf.config,

  // Configuration for Serve Static service
  webpackConfig,
  serveStatic: {
    port,
  },
};

exports.config = config;
```
