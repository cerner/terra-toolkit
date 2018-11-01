<!-- Logo -->
<p align="center">
  <img height="128" width="128" src="https://github.com/cerner/terra-toolkit/raw/master/terra.png">
</p>

<!-- Name -->
<h1 align="center">
  Terra Toolkit
</h1>

[![NPM version](https://badgen.net/npm/v/terra-toolkit)](https://www.npmjs.org/package/terra-toolkit)
[![License](https://badgen.net/github/license/cerner/terra-toolkit)](https://github.com/cerner/terra-toolkit/blob/master/LICENSE)
[![Build Status](https://badgen.net/travis/cerner/terra-toolkit)](https://travis-ci.org/cerner/terra-toolkit)
[![Dependencies status](https://badgen.net/david/dep/cerner/terra-toolkit)](https://david-dm.org/cerner/terra-toolkit)
[![devDependencies status](https://badgen.net/david/dev/cerner/terra-toolkit)](https://david-dm.org/cerner/terra-toolkit?type=dev)

Terra Toolkit is a utility module used to facilitate independent development of Terra projects. This toolkit provides build scripts, configurations, and Webdriver Services needed to serve assets, compile webpack, and run webdriver.io tests to streamline development of npm packages. [terra-core][@terra-core], [terra-clinical][@terra-clinical], and [terra-framework][@terra-framework] are a few examples repos which are utilizing the utilities offered in this package, while [terra-dev-site][@terra-dev-site] is a repo that extends the configurations offered by toolkit.

- [Getting Started](#getting-started)
- [Aggregate Translations Tool](#aggregate-translations-tool)
- [Serve Options](#serve-options)
- [Webdriver.io Utility](#webdriverio-utility)
- [Webpack Configuration](#webpack-configuration)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [LICENSE](#license)

## Getting Started

- Install with [npm](https://www.npmjs.com): `npm install terra-toolkit --save-dev`

Terra Toolkit uses Docker to setup, run, and tear down selenium to ensure a consistent testing environment locally and in continuous integration build systems. To use Terra Toolkit for webdriver testing, you must install docker on your machine.

- Install Docker version 17.09.0 or higher. Installation instructions can be found at https://docs.docker.com/install/.

## Aggregate Translations Tool
Terra components provide internationalization and localization support via `react-intl`. To use the component translations, the `aggregate-translations` pre-build tool will aggregate the translations, and create the intl loader and translation loader files that are configured for the specified locales.

See the [Aggregating Translations Guide](https://github.com/cerner/terra-toolkit/blob/master/docs/AggregateTranslations.md) to get started.

## Serve Options

Terra Toolkit offers two ways to serve your client side application, `serve` and `serve-static`. Serve provides a hot-reloading, development only option via [webpack-dev-server](https://github.com/webpack/webpack-dev-server), while serve-static is a non-hot-reloading [express](https://expressjs.com/) server. Serve-static supports IE10 and is used in webdriver testing.

See the [Serve Guide](https://github.com/cerner/terra-toolkit/blob/master/scripts/serve/README.md) to get started.

## Webdriver.io Utility

[Webdriver.io](http://webdriver.io/) is a framework for writing webdriver powered tests to validate functionality in browsers. The Webdriver.io framework provides services for setting up a selenium server, starting webpack and static servers, running accessibility and visual regression testing, and more.

See the [Webdriver.io Utility Developer's Guide](https://github.com/cerner/terra-toolkit/blob/master/docs/Wdio_Utility.md) to get started.

## Webpack Configuration

[Webpack](https://webpack.js.org/) is a module bundler used to compile modules with dependencies and generate static assets. Webpack is a very powerful tool that is highly configurable and Terra components rely on specific polyfills, webpack loaders and plugins to render correctly. Terra provides a [default webpack configuration](https://github.com/cerner/terra-toolkit/blob/master/config/webpack/webpack.config.js) which we recommend you extend to meet your needs. By using this default configuration, we will manage webpack dependencies and set up translation aggregation.

See the [Webpack Configuration Guide](https://github.com/cerner/terra-toolkit/blob/master/docs/Webpack.md) to get started.

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
[@terra-framework]: https://github.com/cerner/terra-framework
[@terra-dev-site]: https://github.com/cerner/terra-dev-site
