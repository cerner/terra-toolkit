# Axe Service
Terra toolkit automatically includes the axe-core module and provides which enhances a webdriver.io instance with commands for accessibility testing using the [Axe](https://github.com/dequelabs/axe-core) utility.

## Configuration

The Axe Service is preconfigured when extending terra-toolkit's default wdio configuration, however, customize the AxeService via the `axe` key in the wdio.conf.js:

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/config/wdio/wdio.config');

const config = {
  ...wdioConf.config,

  // Configuration for Axe service
  axe: {
    options: {
      /* Whether or not the axe script should be injected by the test running. If axe is already included in the test files (which slightly speed up runs), this should be disabled. This is enabled by default. */
      inject: false,

      /* Configure how axe.run operates via the options parameter. None are adjusted by default. Below is an example of enabling axe in iframes. */
      options: [
        iframes: true,
      ],
      
      /* Extend or override the exisiting set of axe rule by include an array of axe rule objects. None are provided by default. Below is an example of disabling a specific rule. */ 
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    }
  },
};

exports.config = config;
```

* See the [axe documentation](https://www.deque.com/axe/documentation/#api-name-axeconfigure) for information on the axe.configure API.