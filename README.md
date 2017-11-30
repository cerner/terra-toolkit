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

Terra Toolkit uses docker to setup, run, and tear down selenium to ensure a consistent testing environment locally and in continuous integration build systems. To use Terra Toolkit you must install docker on your machine. Installation instructions can be found at https://www.docker.com/.


## Webdriver.io Utility

[Webdriver.io](http://webdriver.io/) is a framework for writing webdriver powered tests to validate functionality in browsers. The Webdriver.io framework provides services for setting up a selenium server, starting webpack and static servers, running accessibility and visual regression testing, and more.

See the [Webdriver.io Utility Developer's Guide](https://github.com/cerner/terra-toolkit/blob/master/docs/Wdio_Utility.md) to get started.

## Nightwatch Utility

Nightwatch.js is an easy to use Node.js based End-to-End (E2E) testing solution for browser based apps and websites. It uses the powerful W3C WebDriver API to perform commands and assertions on DOM elements. Full documentation regarding nightwatch can be found at http://nightwatchjs.org/.

See the [Nightwatch Utility Developer's Guide](https://github.com/cerner/terra-toolkit/blob/master/docs/Nightwatch_Utility.md) to get started.

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
