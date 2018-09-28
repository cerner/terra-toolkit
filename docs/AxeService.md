# Axe Service
Terra toolkit automatically includes the Axe Service, which enhances a webdriver.io instance with commands for accessibility testing using the [axe-core](https://github.com/dequelabs/axe-core) utility.

## Options

Under the key `axe` in the wdio.conf.js you can pass a configuration object with the following structure:

* **inject** - True if the axe script should be injected by the test running. Disable if axe is already included in the test files, which slightly speed up runs. Defaults to true.
* **options** - Additional configuration options for axe.  See the [axe-core documentation](https://www.axe-core.org/docs/) for the axe.configure api.
  * **rules** - An array of rule objects to add to the existing set of rules or override existing rules.  See the [axe-core documentation](https://www.axe-core.org/docs/) for the axe.configure api.

```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/config/wdio/wdio.config');

const config = {
  ...wdioConf.config,

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
  The axe rules configuration to test. See the [axe-core documentation](https://www.axe-core.org/docs/).
* **runOnly**:
  The axe tags to filter the validations to run on the accessibility to test. See the [axe-core documentation](https://www.axe-core.org/docs/).
* **context**:
  A css selector to scope the accessibility test to. See the [axe-core documentation](https://www.axe-core.org/docs/).

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
