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

- Install with [npm](https://www.npmjs.com): `npm install terra-toolkit`

## Test Setup

There are various testing environments that can be run via nightwatch. Currently, these configurations are named in the form <driver>-<size>. The drivers include default (phantomjs), chrome, firefox, ie10, ie11, edge, and safari. The size represents the screen widths tested, which are called tiny, small, medium, large, huge, and enormous; these correspond to the screen widths of 470px, 622px, 838px, 1000px, 1300px, and 1500px respectively.

### Test Settings

The testSettings module sets up the testing environment. It takes in path to the webpack configuration and returns the configured test settings need to set up the webpack dev server, connection to the sauce labs (if tests are running in remote mode), and run the nightwatch tests.

There are some nightwatch conventions that are needed to run the nightwatch tests. Use the nightwatch.json configuration file available within terra-toolkit to help set up these conventions.

```javascript
const testSettings = require('terra-toolkit').testSettings;
const resolve = require('path').resolve;
const nightwatchConfiguration = require('terra-toolkit/lib/nightwatch.json');

module.exports = (settings => (
  testSettings(resolve('../webpack.config'), settings)
))(nightwatchConfiguration);
```


### Screenshots

The screenshot module uses the web driver to take a screenshot of whatever is currently loaded. It is highly recommended to set up a screenshot to be taken at the end of every test.

```javascript
const screenshot = require('terra-toolkit').screenshot;

module.exports = {
  afterEach: (browser, done) => {
    screenshot(browser, 'suite-name', done);
  },
};
```

The screenshots are placed in the target/nightwatch directory in the folder matching the test description and web driver. The file name is the test size appended with any optional tag that was passed in.

## Test Scripts

### Nightwatch Process Script

The nightwatch-process script handles the entire process of running the nightwatch tests.  The script sets up the webpack dev server, connections to the sauce labs (if tests are running in remote mode), runs the tests, and then shuts everything down.

```
node lib/scripts/nightwatch-process.js --config tests/nightwatch.conf.js -e chrome-tiny
```

### Nightwatch Script

The nightwatch script will run tests at all resolutions, in parallel, for the driver indicated in the passed in argument.  If no argument is passed in, the default driver (phantomjs) will be used.  This script runs these tests via the nightwatch-process script to take advantage of the setup and teardown capabilities that that script offers.

```
node lib/scripts/nightwatch.js chrome
```

### Nightwatch Non Parallel Script

The nightwatch-non-parallel script will run tests at all resolutions for the driver indicated in the passed in argument.  If no argument is passed in, the default driver (phantomjs) will be used.  This script runs these tests via the nightwatch-process script to take advantage of the setup and teardown capabilities that that script offers.

```
node lib/scripts/nightwatch-non-parallel.js safari
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
