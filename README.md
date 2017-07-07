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

Terra Toolkit is a utility module used to facilitate development of Terra projects. This toolkit is designed to help support nightwatch testing. It provides configuration, as well as helper functions that can be used during test runs of npm packages within [terra-core][@terra-core] and [terra-clinical][@terra-clinical].

- [Getting Started](#getting-started)
- [Test Setup](#test-setup)
- [Test Scripts](#test-scripts)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [LICENSE](#license)

## Getting Started

- Install with [npm](https://www.npmjs.com): `npm install terra-toolkit --save-dev`

## Test Setup

There are various testing environments that can be run via nightwatch. Currently, these configurations are named in the form  `<driver>-<size>`. The drivers include default (phantomjs), chrome, firefox, ie10, ie11, edge, and safari. The size represents the screen widths tested, which are called tiny, small, medium, large, huge, and enormous; these correspond to the screen widths of 470px, 622px, 838px, 1000px, 1300px, and 1500px respectively.

### Nightwatch Configuration

Webpack and nightwatch configurations are needed to set up the test environment, launch the webpack dev server, and run the nightwatch tests. The terra-toolkit provides default package level webpack and nightwatch configurations via `lib/webpack.config`, however configurations can also be set up via the  testSettings module.  

### Test Settings

The testSettings module sets up the testing environment for package-level component testing. It takes in the webpack configuration path and returns the configured test settings needed to set up the webpack dev server, connection to the sauce labs (if tests are running in remote mode), and run the nightwatch tests. Once these test settings are configured, use them with the `nightwatch.json` configuration file to set up the remaining nightwatch conventions needed to run the nightwatch tests.

```javascript
const testSettings = require('terra-toolkit').testSettings;
const resolve = require('path').resolve;
const nightwatchConfiguration = require('terra-toolkit/lib/nightwatch.json');

module.exports = (settings => (
  testSettings(resolve('../webpack.config'), settings)
))(nightwatchConfiguration);
```

**Note**: the default configuration is for package level testing with configurations paths pointing to the the terra-toolkit node_modules at the repository level. Because of this, there will be settings, like globals_path, which need to be updated to handle repository level tests. This [nightwatch.conf file](https://github.com/cerner/terra-core/blob/master/nightwatch.conf.js) is an example that shows what some of those configuration changes might be.

### Screenshots

The screenshot module uses the web driver to take a screenshot of whatever is currently loaded on the page. It is highly recommended to set up a screenshot to be taken at the end of every test within the `test-suite-spec.js` test file.

```javascript
const screenshot = require('terra-toolkit').screenshot;

module.exports = {
  afterEach: (browser, done) => {
    screenshot(browser, 'suite-name', done);
  },
};
```

As the nightwatch tests run, the screenshots are placed in the `target/nightwatch` directory in the folder matching the test description and web driver. The file name is the test size appended with any optional tag that was passed in.

## Test Scripts
There are three test scripts available:
1. nightwatch-process
2. nightwatch
3. nightwatch-non-parallel

The nightwatch and nightwatch-non-parallel scripts run their tests via the nightwatch-process script to take advantage of the test setup and teardown capabilities that the nightwatch-process script offers. They provide the test and environment configurations needed to run the tests via the nightwatch-process script.

These scripts allow for the following environment variables: `SPECTRE_TEST_SUITE`, `WEBPACK_CONFIG_PATH`, `SAVE_TO_SPECTRE`, `REMOTE`, `SAUCE_USERNAME`, and `SAUCE_ACCESS_KEY`.

**Notes**:
- If running a test in remote mode, the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` variables must be provided.
- When specifying the `WEBPACK_CONFIG_PATH`, provide the path from the `node_modules/terra-toolkit/lib/` directory.

### Nightwatch Process Script

The nightwatch-process script handles the entire process of running the nightwatch tests.  The script sets up the webpack dev server, connections to the sauce labs (when in remote mode), runs the tests, and then shuts everything down. The script runs the nightwatch tests for the configurations provided in the indicated environment(s).

To indicated the environment, add the `--env` flag, followed by the desired `<driver>-<size>` environment(s).

```javascript
## Run the chome driver for tiny size
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-process.js --env chrome-tiny

## Run the chome driver for tiny, small, and huge sizes
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-process.js --env chrome-tiny,chrome-small,chrome-huge
```

To provide the nightwatch testing configurations, either
1. Add a `nightwatch.conf.js` file within the same directory of the process that uses the nightwatch-process script
2. Use the `--config` flag to provide the path to a `nightwatch.conf.js` file.

```javascript
## Uses the nightwatch.conf file within the current directory
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-process.js --env chrome-tiny

## Uses the --config flag to use the the tests/nightwatch.conf file
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-process.js --config tests/nightwatch.conf --env chrome-tiny

## Uses the --config flag to use the nightwatch.conf file provided by terra-toolkit
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-process.js --config ../../node_modules/terra-toolkit/lib/nightwatch.conf.js --env chrome-tiny
```

### Nightwatch Script

The nightwatch script will run tests at all resolutions, in parallel, for the driver indicated in the passed in argument.  If no argument is passed in, the default driver (phantomjs) will be used.

```javascript
## Run the default driver (phantomjs)
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch.js

## Run the chrome driver
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch.js chrome
```

The default nightwatch testing environment will be used unless the `WEBPACK_CONFIG_PATH` is specified.

### Nightwatch Non Parallel Script

The nightwatch-non-parallel script will run tests at all resolutions for the driver indicated in the passed in argument.  If no argument is passed in, the default driver (phantomjs) will be used.

```javascript
## Run the default driver (phantomjs)
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-non-parallel.js

## Run the safari driver
node ../../node_modules/terra-toolkit/lib/scripts/nightwatch-non-parallel.js safari
```

The default nightwatch testing environment will be used unless the `WEBPACK_CONFIG_PATH` is specified.

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
