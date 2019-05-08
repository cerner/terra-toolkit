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
    options: {
      rules: [
         // disabling specific rules when testing accessibility
        { id: 'landmark-one-main', enabled: false },
      ],
    }
  },
};

exports.config = config;
```


## Writing Tests
With the Terra Service, you have access to the `Terra.should.beAccessible()` assertion. This `it` block will run axe for the options provided and use a custom chai assertion to validating results have no errors.

### Test Options
The following are the list of available test options that can be used:

* **context**:
  A css selector to scope the accessibility test to. By default the global selector will be used. See the [axe-core documentation](https://www.axe-core.org/docs/).
* **rules**:
  The axe rules to use during the test. See the [axe-core documentation](https://www.axe-core.org/docs/).
* **viewports**:
  The array of viewports `{ width, height }` to run the accessibility test in. By default the current viewport will be used. It is not recommended to use this options as this can cause undesirable behavior when testing responsive UIs. Instead, consider looping the desired viewport to manager how UI renders.

### Example Usage
```js
describe('check assessibility', () => {
  before(() => browser.url('/home.html'));

  // use defaults
  Terra.should.beAccessible();

  // custom context
  Terra.should.beAccessible('#my-list');
})
```


