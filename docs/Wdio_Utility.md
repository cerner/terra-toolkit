# Webdriver.io Utility Developer's Guide

[Webdriver.io](http://webdriver.io/) is a framework for writing webdriver powered tests to validate functionality in browsers. The Webdriver.io framework provides services for setting up a selenium server, starting webpack and static servers, running accessibility and visual regression testing, and more.

- [Getting Started](#getting-started)
- [Configuration Setup](#configuration-setup)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)

## Getting Started
The [webdriverio](https://www.npmjs.com/package/webdriverio), [wdio-mocha-framework](https://www.npmjs.com/package/wdio-mocha-framework), [wdio-visual-regression-service](https://www.npmjs.com/package/wdio-visual-regression-service) peerDependencies must be installed to utilize the Wdio Utilities.

- Install with npm: `npm install webdriverio --save-dev`
- Install with npm: `npm install wdio-mocha-framework --save-dev`
- Install with npm: `npm install wdio-visual-regression-service --save-dev`

## Configuration Setup

Terra-toolkit provides a default [webdriver.io configuration](https://github.com/cerner/terra-toolkit/blob/master/src/wdio/conf.js) that enables the following services for a mocha test framework:

* SeleniumDockerService - starts a Selenium-Docker instance.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/SeleniumDockerService.md) for configuration information.
* AxeService - provides utilities for accessibility testing.
    - See [here](https://github.com/cerner/terra-toolkit/blob/master/docs/AxeService.md) for configuration information.
* TerraService - provides custom assertions and a Terra global helper to make testing easier.
* Visual Regression Service - provides configuration for wdio visual regression testing.

In addition to the default webdriver.io services enabled in the config, a webpack dev server or static server service must be specified to actually run the site:
- Terra-toolkit provides the [WebpackDevService](https://github.com/cerner/terra-toolkit/blob/master/docs/WebpackDevServerService.md) to start a webpack-dev-server and return a promise when the webpack compiler is completed
- Webdriver.io provides the [wdio-static-server-service](https://www.npmjs.com/package/wdio-static-server-service) to run a static file server.

Additional configuration will be needed to enable either of these services.

Finally, the `baseUrl` must be specified to be the site to be tested. Use the [ip](https://www.npmjs.com/package/ip) npm package to obtain the IP address for the SeleniumDocker instance.

More information regarding the webdriver.io configuration options can be found [here](http://webdriver.io/guide/testrunner/configurationfile.html).

```javascript
// An example of a full mono-repo configuration file:
const wdioConf = require('terra-toolkit/wdio/conf');
const webpackConfig = require('./webpack.config.js');
const WebPackDevService = require('terra-toolkit/lib/wdio/services').WebPackDevService;
const localIP = require('ip');

const port = 8080;

let specs;
const isRepoTest = !process.cwd().includes('/packages/');

if (isRepoTest) {
  specs = path.join(__dirname, 'packages', 'terra-**', 'tests', 'wdio', '**', '*-spec.js');
} else {
  specs = path.join('tests', 'wdio', '**', '*-spec.js');
}

const config = {
  ...wdioConf.config,

  // Point base URL at the site to be tested for correct webdriver.io setup
  baseUrl: `http://${localIP.address()}:${port}`,
  specs: [specs],

  // Use Terra-toolkit's WebPackDevService
  services: wdioConf.config.services.concat([WebPackDevService]),

  // Configuration for WebPackDevService
  webpackConfig,
  webpackPort: port,
};

exports.config = config;
```

## Writing Tests

There are a few things to note about the webdriver.io configuration provided by Terra-Toolkit:

- Test files should use `*-spec.js` naming format. The default spec search path is `./tests/wdio/**/*-spec.js`.
- Use `/test_url_path` to direct test urls. This is appended to the `baseUrl` provided in the config.



Then, to assist with testing, the TerraService provides the Terra global helper to make testing easier:

- `Terra.viewports(name)` takes the viewport key name(s) and returns an array of { height, width } objects representing the respective terra viewport size(s).
    - Use this function to resize the browser or pass the viewport sizes to the accessibility and visual regression commands.
    - By default returns all viewports if not name key are provided.
- `Terra.should.beAccessible()` convenience method that injects an axe test. Takes the same arguments as the `axe()` utility. See [beAccessible-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/beAccessible-spec.js) for examples.
- `Terra.should.matchScreenshot(name, options)` convenience method that injects a screenshot test. See [matchScreenshot-spec.js](https://github.com/cerner/terra-toolkit/blob/master/tests/wdio/matchScreenshot-spec.js) for example usage..
- `Terra.should.themeEachCustomProperty(properties)` convenience method that runs a visual comparison test for each custom property given.

```js
// These globals are provide via the Terra Service
/* global browser, describe, it, expect, viewport */

describe('Basic Test', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/test.html'));

  Terra.should.beAccessible({ viewports });
  Terra.should.matchScreenshot({ viewports });
  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '20px',
  });

  it('custom test', () => {
    expect('something').to.equal('something');
  });
});
```


If more control is needed over the assertions, the TerraService also provides the custom assertions `accessible` and `matchReference`:

- `accessible()` validates the `axe()` accessibility assertions on the specified viewports are successful.
- `matchReference()` validates the `checkElement` visual regression assertions on the specified viewports are successful.

```js
// These globals are provide via the Terra Service
/* global browser, describe, it, expect, viewport */


describe('Advanced Test', () => {
  // Only test tiny and huge viewports
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => browser.url('/test.html'));

  it('checks accessibility', () => {
    expect(browser.axe()).to.be.accessible();
  });

  it('checks visual comparison', () => {
    const screenshots = browser.checkViewport({ viewports });
    expect(screenshots).to.matchReference();
  });

  it('switches viewport sizes', () => {
    viewports.forEach(size, () => {
      browser.setViewportSize(size);
    });
  });
});
```

### Testing multiple viewports.
Sometimes its necessary to rerun the test steps in each viewport. To do this, `Terra.viewports` can be used to wrap the `describe` block. Example:

```js
Terra.viewports('tiny', 'small', 'large').forEach((viewport) => {
  describe('Resize Example', () => {
    before(() => {
      browser.setViewportSize(viewport);
      browser.url('/test.html');
    });

    it(`resizes ${viewport.name}`, () => {
      const size = browser.getViewportSize();
      expect(size.height).to.equal(viewport.height);
      expect(size.width).to.equal(viewport.width);
    });
  });
});
```

This will generate a describe block for each viewport.


## Running Tests
Installation of webdriver.io provides access to the wdio test runner. To start the runner, add the wdio npm script to the package.json and then provide the wdio configuration file. The wdio test runner requires a configuration file to be passed either from the current directory or by path.

```javascript
// NPM Script at the root-level of a mono-repo with config in same directory
"wdio": "wdio";

// NPM Script at a package-level of a mono-repo
"wdio": "wdio ../../wdio.conf.js";
```
