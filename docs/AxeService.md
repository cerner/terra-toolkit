# Axe Service
Terra toolkit automatically includes the wdio-axe-service which enhances a webdriver.io instance with commands for accessibility testing using the [Axe](https://github.com/dequelabs/axe-core) utility.

## Options

Under the key `axe` in the wdio.conf.js you can pass a configuration object with the following structure:

* **options** - Additional configuration options for axe.  See [axe documentation](https://www.axe-core.org/docs/) for the axe.configure api.
  * **rules** - An array of rule objects to add to the existing set of rules or override existing rules.  See [axe documentation](https://www.axe-core.org/docs/) for the axe.configure api.

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const localIP = require('ip');

const port = 4567;

const config = {
  ...wdioConf.config,

  // Point base URL at the site to be tested for correct webdriver.io setup
  baseUrl: `http://${localIP.address()}:${port}`,

  // Configuration for Axe service
  axe: {
    // disabling specific rules when testing accessibility
    options: {
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    }
  },
};

exports.config = config;
```


## Writing Tests

`browser.axe([{options}]);`

The following options are available:

* **viewports**:
  An array of viewports `{ width, height }` to run the accessibility test in. If none provided, by default it uses the current viewport.
* **rules**:
  The axe rules configuration to test. See [axe documentation](https://www.axe-core.org/docs/).
* **runOnly**:
  The axe tags to filter the validations to run on the accessibility to test. See [axe documentation](https://www.axe-core.org/docs/).
* **context**:
  A css selector to scope the accessibility test to. See [axe documentation](https://www.axe-core.org/docs/).

Then, the Axe Service provides the custom custom assertion `accessible()` to make validating the output of accessibility commands easier.

```js
// Use viewport helper to get { width, height } by name.
const viewports = Terra.viewports('tiny', 'huge');

it('ignores inaccessibility based on rules', () => {
  browser.url('/inaccessible-contrast.html');
  const rules = {
    'color-contrast': { enabled: false },
  };
  expect(browser.axe({ viewports, rules })).to.be.accessible();
});

it('runs only specified tags', () => {
  browser.url('/inaccessible-text.html');
  const runOnly = {
    type: 'tag',
    values: ['color-contrast'],
  };
  expect(browser.axe({ viewports, runOnly })).to.be.accessible();
});

it('runs only specified context', () => {
  browser.url('/inaccessible-contrast.html');
  let context = 'h1';
  expect(browser.axe({ viewports, context })).to.not.be.accessible();

  context = 'h2';
  expect(browser.axe({ viewports, context })).to.be.accessible();
});
```
