# Webdriver.io Utility Developer's Guide

[Webdriver.io](http://v4.webdriver.io/) is a framework for writing webdriver powered tests to validate functionality in browsers. The Webdriver.io framework provides services for setting up a selenium server, starting webpack and static servers, running accessibility and visual regression testing, and more.

- [Getting Started](#getting-started)
- [Configuration Setup](#configuration-setup)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)

## Getting Started
Terra Toolkit uses docker to setup, run, and tear down selenium to ensure a consistent testing environment locally and in continuous integration build systems. To use Terra Toolkit you must install docker on your machine. Installation instructions can be found at https://www.docker.com/.  **Requires Docker v17.09.0 or higher.**

- Install with [npm](https://www.npmjs.com): `npm install terra-toolkit --save-dev`

## Configuration Setup

To run the webdriver.io test running, the [webdriver.io configuration options](http://v4.webdriver.io/guide/testrunner/configurationfile.html) must be specified in the `wdio.conf.js` file. Terra-toolkit provides a [default webdriver.io configuration](https://github.com/cerner/terra-toolkit/blob/master/config/wdio/wdio.conf.js) that enables the following services for a mocha test framework:

* `SeleniumDockerService` - starts a Selenium-Docker instance.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/SeleniumDockerService.md) for configuration information.
* `TerraService` - provides utilities for accessibility testing as well as gives global access to chai and a Terra object containg helpers to make testing easier. 
    - A global selector must be defined: add `terra: { selector: 'selector_name' }` to the configuration.
    - To disable theme testing add `terra: { disableThemeTests: true }` to the configuration. This will skip the following functions during testing: `themeEachCustomProperty` and `themeCombinationOfCustomProperties`. 
    - To configure the acessibilty utility, add `axe: { options: {} }` to be passed to the axe instance that is inject on the test page. See [axe-core's axe.configure docs](https://www.deque.com/axe/axe-for-web/documentation/api-documentation/#api-name-axeconfigure) for possible configuraiton options.
* `VisualRegressionService` - uses wdio-screenshot to capture screenshots and run visual regression testing.
    - See [here](https://github.com/zinserjan/wdio-visual-regression-service#configuration) for configuration information.
* `ServeStaticService` - to start a server and returns a promise when the webpack compiler is completed.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/TerraToolkitServeStaticService.md) for configuration information.

```javascript
// wdio.config.js
const wdioConf = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('./webpack.config.js');

const config = {
  ...wdioConf.config,

  // Configuration for ServeStaticService
  webpackConfig,

  // Configuration for TerraService
  terra: {
    selector: '[content-wrapper] *:first-child'
  },
};

exports.config = config;
```

### Environment Variables

* To support testing inside of a container and hitting an external selenium grid, three environment variables are provided:

  * `WDIO_INTERNAL_PORT` - This specifies the port for the ServeStaticService. This is the port that the server being tested against will actually run on.
  * `WDIO_EXTERNAL_PORT` - This specifies the external port that is mapped on the container to the WDIO_INTERNAL_PORT.
  * `WDIO_EXTERNAL_HOST` - This specifies the externally accessible name for the host on which the container is running.
* In order to stop test runner as soon as a single test has failed, explicitly set the environment variable `WDIO_BAIL` to true. By default all the tests are run regardless of failures.

## Writing Tests

There are a few things to note about the webdriver.io configuration provided by Terra-Toolkit:

- Test files should use `*-spec.js` naming format. The default spec search paths are `./tests/wdio/**/*-spec.js` and `./packages/*/tests/wdio/**/*-spec.js`.
- Use `/test_url_path` to direct test urls. This is appended to the `baseUrl` provided in the config.

Then, to assist with testing, the TerraService provides the Terra global helper to make testing easier:

- `Terra.viewports(name)` takes the viewport key name(s) and returns an array of { height, width } objects representing the respective terra viewport size(s).
    - Use this function to resize the browser or pass the viewport sizes to the accessibility and visual regression commands.
    - By default returns all viewports if not name key are provided.
- `Terra.should.beAccessible()` mocha-chai convenience method that runs an axe test for the page. Takes the same arguments as the `axe()` utility.
    - See [beAccessible-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/beAccessible-spec.js) for examples.
- `Terra.should.matchScreenshot()` **Note - It is preferred to use Terra.should.validateElement().  Terra.should.matchScreenshot() may eventually be deprecated** mocha-chai convenience method that takes a screenshot for the specified viewports and verifies the images are within the specified mis-match tolerance. Note: this method provides its own mocha it test case. The methods accepts these arguments (in this order):
    - String (optional): the test case name. Default name is 'default'
    - Object (optional): the test options. Options include selector, viewports, and misMatchTolerance:
         - selector: the element selector to take a screenshot of. Defaults to the global terra.selector.
         - viewports: the array of viewports dimensions to take a screenshot in. Defaults to the current viewport size.
         - misMatchTolerance: number between 0 and 100 that defines the degree of mismatch to consider two images as identical, increasing this value will decrease test coverage. Defaults to the global visualRegression.compare.misMatchTolerance.
    - See [matchScreenshot-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/matchScreenshot-spec.js) for example usage.
- `Terra.should.validateElement()` mocha-chai convenience method that takes a screenshot and verifies the images are within the specified mis-match tolerance and performs accessibility validation. Note: this method provides its own mocha it test case. Also, since viewports isn't accepted in this method, you need to [test in multiple viewports](#testing-multiple-viewports) This method accepts these arguments (in this order):
    - String (optional): the test case name. Default name is 'default'
    - Object (optional): the test options. Options include selector, misMatchTolerance and axeRules:
         - selector: the element selector to take a screenshot of. Defaults to the global terra.selector.
         - misMatchTolerance: number between 0 and 100 that defines the degree of mismatch to consider two images as identical, increasing this value will decrease test coverage. Defaults to the global visualRegression.compare.misMatchTolerance.
         - axeRules: the axe rules to use as overrides if necessary.
    - See [validateElement-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/validateElement-spec.js) for example usage.
- `Terra.should.themeEachCustomProperty()` mocha-chai convenience method that runs a visual comparison test for each custom property given. Note: this method provides its own mocha it test case. The methods accepts these arguments (in this order):
    - String (optional): the element selector to take a screenshot of. Defaults to the global terra.selector.
    - Object: list of themeable-variable key-value pairs such that the key is the themeable-variable name and the value is the css value to check in the screenshot.
  - `Terra.should.themeCombinationOfCustomProperties()` mocha-chai convenience method that runs a visual comparison test for a grouping of custom properties provided. Note: this method provides its own mocha it test case. The methods accepts these arguments (in this order):
      - Object: the test options. Options include testName, selector and properties:
           - testName (optional): the name associated to the test. Used to create unique screenshots. Defaults to `themed`.
           - properties (required): object of themeable-variable key-value pairs such that the key is the themeable-variable name and the value is the css value to check in the screenshot.
           - selector (optional): the element selector to take a screenshot of. Defaults to the global terra.selector.

```js
// These globals are provide via the Terra Service
/* global browser, describe, it, expect, viewport */
describe('Basic Test', () => {
  before(() => browser.url('/test.html'));

  Terra.should.beAccessible();
  Terra.should.matchScreenshot();
  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '20px',
  });

  it('custom test', () => {
    expect('something').to.equal('something');
  });
});
```

### Testing multiple viewports.
Sometimes its necessary to rerun the test steps in each viewport. Some build systems support running viewports in parallel and control the viewport via the FORM_FACTOR environment variable. For build systems that don't support parallelization, `Terra.viewports` can be used to wrap the `describe` block. Example:

```js
Terra.viewports('tiny', 'small', 'large').forEach((viewport) => {
  describe(`Resize Example - ${viewport.name}`, () => {
    before(() => {
      browser.setViewportSize(viewport);
      browser.url('/test.html');
    });

    it(`correctly resized to ${viewport.name}`, () => {
      const size = browser.getViewportSize();
      expect(size.height).to.equal(viewport.height);
      expect(size.width).to.equal(viewport.width);
    });
  });
});
```

## Running Tests
Installation of webdriver.io provides access to the wdio test runner. To start the runner, add the wdio npm script to the package.json and then provide the wdio configuration file. The wdio test runner requires a configuration file to be passed either from the current directory or by path.

```json
// run wdio cli directly
"wdio": "wdio";
```

Terra-toolkit also provides the tt-wdio script to run wdio test runs for specified locales and form factors in a syrsynchronous fashion. This script is helpful for generating results a parallelize CI pipeline could produce.
```json
// run terra-toolkit's wdio script for consecutive FormFactor and Locale parallel tests
"wdio": "tt-wdio --config wdio.conf.js";
```
