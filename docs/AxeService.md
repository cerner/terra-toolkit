#### Axe Service
Terra toolkit automatically includes the wdio-axe-service which enhances an WebdriverIO instance with commands for accessibility testing using the [Axe](https://github.com/dequelabs/axe-core) utility.

#### Options

Under the key `axe` in the wdio.conf.js you can pass a configuration object with the following structure:

* **inject** - True if the axe script should be injected by the test running. Disable if axe is already included in the test files which slightly speed up runs. Defaults to true.

#### Example
```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const localIP = require('ip');

const port = 4567;

const config = {
  ...wdioConf.config,

  // Point base URL to the site to be tested
  baseUrl: `http://${localIP.address()}:${port}`,

  // Configuration for Axe service
  axe: {
    // Don't inject axe script, its included in test files
    inject: false,
  },
};

exports.config = config;
```


#### Usage

`browser.axe([{options}]);`

The following options are available:

* **viewports**:
  An array of viewports `{ width, height }` to run the accessibility test in. If none provided uses the current viewport.
* **rules**:
  The axe rules configuration to test. See [axe documentation](https://www.axe-core.org/docs/)
* **runOnly**:
  The axe tags to filter the validations to run on the accessibility to test. See [axe documentation](https://www.axe-core.org/docs/)
* **context**:
  A css selector to scope the accessibility test to. See [axe documentation](https://www.axe-core.org/docs/)

#### Examples
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


The Axe Service provides the custom custom assertion `accessible()` to make validating the output of accessibility commands easier.

```js
// Validate it is accessible
expect(browser.axe()).to.be.accessible();
// Validate it is not accessible
expect(browser.axe()).to.not.be.accessible();
```
