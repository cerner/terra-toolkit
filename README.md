<!-- Logo -->
<p align="center">
  <img height="128" width="128" src="https://github.com/cerner/terra-toolkit/raw/master/terra.png">
</p>

<!-- Name -->
<h1 align="center">
  Terra Toolkit
</h1>

[![NPM version](http://img.shields.io/npm/v/terra-toolkit.svg)](https://www.npmjs.org/package/terra-toolkit)
[![Build Status](https://travis-ci.org/cerner/terra-toolkit.svg?branch=master)](https://travis-ci.org/cerner/terra-toolkit)

Terra Toolkit is a utility module used to facilitate independent development of Terra projects. This toolkit provides configuration and helpers needed for nightwatch and webdriver.io testing to streamline development of npm packages. [terra-core][@terra-core] and [terra-clinical][@terra-clinical] are two example mono-repos which are utilizing utilities offered in this package.

- [Getting Started](#getting-started)
- [Webdriver.io Utility](#webdriverio-utility)
- [Nightwatch Utility](#nightwatch-utility)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [LICENSE](#license)

## Getting Started

- Install with [npm](https://www.npmjs.com): `npm install terra-toolkit --save-dev`

## Webdriver.io Utility
[Webdriver.io](http://webdriver.io/) is a framework for writing webdriver powered tests to validate functionality in browsers. Webdriver.io also provides easy services for setting up selenium, starting webpack and static servers, as well as accessibilty and visual regression testing.

To make testing easier, Terar toolkit provides default configuration that enables the following:

* Selenium docker instances for a consistent testing environment
* Axe accessibility Utility
* Visual regression testing
* Viewport resizing helpers
* Mocha test framework.

### Installation
1. Install docker on your machine: https://www.docker.com/

2. In your root directory, create a `wdio.conf.js` file that inherits from Terra Toolkit's base config.

```js
const wdioConf = require('terra-toolkit/wdio/conf');
const localIP = require('ip');

const staticServerPort = 4567;

const config = {
  baseUrl: `http://${localIP.address()}:${staticServerPort}`,
  // TOOD: Custom wdio config goes here. See: http://webdriver.io/guide/testrunner/configurationfile.html
  ...wdioConf.config,
};

exports.config = config;
```

### Selenium Docker
Selenium docker is provided as a convenience to make selenium testing easier and more stable. Running selenium in a container ensures a consistent testing environment across testing environments which is critical for visual regression testing.

#### Options

Under the key `seleniumDocker` in your wdio.conf.js you can pass a configuration object with the following structure:

* **cidfile** - The name of the docker cidfile used to manage the docker instance during tests. Defaults to '.docker_selenium_id',
* **enabled** - Flat to disable selenium docker; useful for CI environments which can startup the docker instance outside of test runs. Defaults to true
* **cleanup** - Destroy the docker container after the test run. Defaults to false.
* **image** - The docker image to use for test runs. Defaults to `selenium/standalone-chrome` or `selenium/standalone-firefox` based on browser capabilities specified in config.

#### Example
```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const localIP = require('ip');

const staticServerPort = 4567;

const config = {
  baseUrl: `http://${localIP.address()}:${staticServerPort}`,
  seleniumDocker: {
    // Disable if running in Travis
    enabled: !process.env.TRAVIS,
  },
  ...wdioConf.config,
};

exports.config = config;
```


### Accessibility Tests
Terra toolkit automatically includes a wdio-axe-service which enhances an WebdriverIO instance with commands for accessibility testing using the [Axe](https://github.com/dequelabs/axe-core) utility.

#### Options

Under the key `axe` in your wdio.conf.js you can pass a configuration object with the following structure:

* **inject** - True if the axe script should be injected by the test running. Disable if axe is already included in the test files which slightly speed up runs. Defaults to true.

#### Example
```js
// wdio.conf.js
const wdioConf = require('terra-toolkit/wdio/conf');
const localIP = require('ip');

const staticServerPort = 4567;

const config = {
  baseUrl: `http://${localIP.address()}:${staticServerPort}`,
  axe: {
    // Don't inject axe script, its included in test files
    inject: false,
  },
  ...wdioConf.config,
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

### Visual Regression Tests
Terra toolkit provides configuration for a visual regression utility. See [documentation](http://webdriver.io/guide/services/visual-regression.html) for more information. Terra Toolkit provides useful wrappers to make setup easier.

Visual regression tests can be written using the commands provided by the [visual regression service](http://webdriver.io/guide/services/visual-regression.html). Example:

```js
/* global browser, describe, it, expect, viewport */
describe('button test', () => {
  // Only test tiny/huge viewports
  const viewports = viewport('tiny', 'huge');
  it('checks visual comparison', () => {
    browser.url('/buttons.html');

    // Verify the button element matches
    let screenshots = browser.checkElement('button', { viewports });
    expect(screenshots).to.matchReference();

    // Verify the whole viewport matches
    let screenshots = browser.checkViewprot({ viewports });
    expect(screenshots).to.matchReference();
  });
});
```

### Test Helpers

The terra toolkit provides custom assertions and globals to make testing easier.

#### Viewports

The `viewports()` function provides a convenience method for fetching an array of viewports to use to resize the browser or even pass directly to the accessibility and visual regression commands.

##### Usage
wdio-axe-service enhances an WebdriverIO instance with the following command:

`viewports(name);`

The following options are available:

* **name**:
  Takes the viewport keys and returns an array of `{ height, width}` objects representing the respective viewport size(s). If no key is passed, returns all viewports.


##### Example

```js
/* global browser, describe, it, expect, viewport */
describe('Resizing browser', () => {
  // Only test tiny/huge viewports
  const viewports = viewport('tiny', 'huge');
  it('switches viewport sizes', () => {
    browser.url('/foo.html');
    viewports.forEach(size, () => {
      // Resize browser to each viewport size
      browser.setViewportSize(size);
    });
  });
});
```

#### Assertions
2 custom assertions are provided to make validating the output of the visual regression and accesibility commands easier.


`accessible()`

```js
// Validate it is accessible
expect(browser.axe()).to.be.accessible();
// Validate it is not accessible
expect(browser.axe()).to.not.be.accessible();
```


`matchReference()`

```js
// Validate it matches
expect(screenshots).to.matchReference();
// Validate it does not match
expect(screenshots).to.not.matchReference();
```




## Nightwatch Utility
Nightwatch.js is an easy to use Node.js based End-to-End (E2E) testing solution for browser based apps and websites. It uses the powerful W3C WebDriver API to perform commands and assertions on DOM elements. Full documentation regarding nightwatch can be found at http://nightwatchjs.org/.


### Configuration Setup

Terra-toolkit provides a nightwatch setup function, called `nightwatchConfig`, which provides the nightwatch configuration needed to setup the test environment, launch the webpack-dev-server, and run the nightwatch tests. It takes three parameters:

1. the webpack configuration used to start the webpack-dev-server
2. the src folders where nightwatch searches for the tests
3. [optional] the port number to start the webpack-dev-server - defaults to port 8080


Terra-toolkit provides the setup helper, `getPackageTestDirectories`, to aggregate all mono-repo package test folders when its supplied with the repository's `lerna.json` file. Note: this helper does assumes the package structure is 'package_name/tests/nightwatch'.

```javascript
// An example of a mono-repo configuration file:
const nightwatchConfig = require('terra-toolkit/lib/nightwatch/nightwatch.config.js').default;
const webpackConfig = require('./webpack.config');
const getPackageTestDirectories = require('terra-toolkit/lib/nightwatch/setup-helper.js').getPackageTestDirectories;

let srcFolders;
const isRepoTest = !process.cwd().includes('/packages/');

if (isRepoTest) {
  srcFolders = getPackageTestDirectories('lerna.json');
} else {
  srcFolders = 'tests/nightwatch/';
}

const config = nightwatchConfig(webpackConfig, srcFolders, 9000);

module.exports = config;
```


### Writing Tests

There are a few things to note about the nightwatch configuration generated by Terra-Toolkit:

- Test files should use `*-spec.js` naming format. The generated configuration filters on `**/*-spec.js`.
- An after test hook is provided which calls the nightwatch `.end()` function.
- Use `${browser.launchUrl}/#/test_url_path` to direct test urls. The generated configuration sets the launchUrl to `http://localhost:${port}`.
- [ChromeDriver](https://www.npmjs.com/package/chromedriver) is the default testing environment and it's default browser size is 800x600.

To assist with testing various browser sizes, Terra-toolkit provides the responsive test helpers, `resizeTo` and `screenWidth`.
- `resizeTo` wraps the nightwatch test suite and handles browser resizing on the breakpoints provided. The breakpoint options, `tiny`, `small`, `medium`, `large`, `huge`, and `enormous`, represent the screen widths tested; these correspond to the screen widths of 470px, 622px, 838px, 1000px, 1300px, and 1500px respectively.
- `screenWidth` returns the current screen width. This helper must be used in conjunction with `resizeTo`.

```javascript
const { resizeTo, screenWidth } = require('terra-tookit/lib/nightwatch/responsive-helpers');

module.exports = resizeTo(['tiny', 'small', 'medium', 'large', 'huge', 'enormous'], {
  'Static test path one renders correctly': (browser) => {
    browser.url(`${browser.launchUrl}/#/test-path-1`);
    browser.expect.element('.test').text.to.equal('Test');
  },

  'Responsive test path two renders correctly': (browser) => {
    browser.url(`${browser.launchUrl}/#/test-path-2`);
    const width = screenWidth(browser);

    if (width <= browser.globals.breakpoints.tiny[0]) {
      browser.expect.element('.test').text.to.equal('Tiny Response');
    } else {
      browser.expect.element('.test').text.to.equal('Default Response');
    }
  },
});
```

Finally, it is **highly recommended** to use the expect API over the assert API. Expect is a Behavior Driven Development interface which aligns more appropriately with react renderings and interactions.

#### Writing Tests with ChromeDriver:
 - ChromeDriver clicks the center of an element.
 - ChromeDriver cannot click moving objects. More information [here](https://sites.google.com/a/chromium.org/chromedriver/help/clicking-issues).
 - ChromeDriver's clearValue functions correctly, but does not trigger a change for an element.

### Running Tests
Installation of the terra-toolkit will install a global reference to Nightwatch, providing access to the nightwatch test runner. The nightwatch test runner requires a configuration file to be passed either from the current directory or via the `--config` or `-c` followed by the config path.

```javascript
// Script at the root-level of a mono-repo with config in same directory
"nightwatch": "nightwatch";

// Script at a package-level of a mono-repo
"nightwatch": "$(cd ..; npm bin)/nightwatch -c ../../nightwatch.conf.js";
```

## Versioning

Terra-toolkit is considered to be stable and will follow [SemVer](http://semver.org/) for versioning.
1. MAJOR versions represent breaking changes
2. MINOR versions represent added functionality in a backwards-compatible manner
3. PATCH versions represent backwards-compatible bug fixes

Consult the component CHANGELOGs, related issues, and PRs for more information.

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for issue reporting and pull requests.

## LICENSE

Copyright 2017 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

[@terra-core]: https://github.com/cerner/terra-core
[@terra-clinical]: https://github.com/cerner/terra-clinical
