# Webdriver.io Utility Developer's Guide

[Webdriver.io](http://webdriver.io/) is a framework for writing webdriver powered tests to validate functionality in browsers. The Webdriver.io framework provides services for setting up a selenium server, starting webpack and static servers, running accessibility and visual regression testing, and more.

- [Getting Started](#getting-started)
- [Configuration Setup](#configuration-setup)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)

## Getting Started
Terra Toolkit uses docker to setup, run, and tear down selenium to ensure a consistent testing environment locally and in continuous integration build systems. To use Terra Toolkit you must install docker on your machine. Installation instructions can be found at https://www.docker.com/.  **Requires Docker v17.09.0 or higher.**

- Install with [npm](https://www.npmjs.com): `npm install terra-toolkit --save-dev`

## Default Configuration

[Webdriver.io configuration](http://webdriver.io/guide/testrunner/configurationfile.html) must be specified in the `wdio.conf.js` file. Terra-toolkit provides a [default webdriver.io configuration](https://github.com/cerner/terra-toolkit/blob/master/config/wdio/wdio.conf.js) that enables the following services for a mocha test framework:

* `SeleniumDockerService` - starts a Selenium-Docker instance.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/SeleniumDockerService.md) for configuration information.
* `AxeService` - provides utilities for accessibility testing.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/AxeService.md) for configuration information.
* `TerraService` - provides global access to chai, custom chai assertions and a Terra helper to make testing easier.
    - To provide a custom global selector, add `terra: { selector: 'selector_name' }` to the configuration.
* `VisualRegressionService` - uses wdio-screenshot to capture screenshots and run visual regression testing.
    - See [here](https://github.com/zinserjan/wdio-visual-regression-service#configuration) for configuration information.
* `ServeStaticService` - to start a server and returns a promise when the webpack compiler is completed.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/TerraToolkitServeStaticService.md) for configuration information.

```javascript
// An example of a full mono-repo configuration file:
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

In order to support tests running inside of a container and hitting an external selenium grid, environment variables are provided:

* `LOCALE` - The locale to run the tests against in the container.
* `FORM_FACTOR` - The terra viewport to run the tests against in the container.
* `WDIO_INTERNAL_PORT` - This specifies the port for the ServeStaticService. This is the port that the server being tested against will actually run on.
* `WDIO_EXTERNAL_PORT` - This specifies the external port that is mapped on the container to the WDIO_INTERNAL_PORT.
* `WDIO_EXTERNAL_HOST` - This specifies the externally accessible name for the host on which the container is running.
* `CI` and `TRAVIS` - Whether or not to use the local wdio configuration.

## Running Tests
Installation of webdriver.io provides access to the wdio test runner. To start the runner, add the wdio npm script to the package.json and then provide the wdio configuration file. The wdio test runner looks for a configuration file in the current directory or must be passed via its path.

```javascript
// NPM Script at the root-level of a mono-repo with config in same directory
"wdio": "wdio";

// NPM Script at a package-level of a mono-repo
"wdio": "wdio ../../wdio.conf.js";
```

Terra toolkit also provides the `tt-wdio` wdio runner script to enable local locale and form factor test runs. This script 
