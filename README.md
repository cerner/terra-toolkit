<!-- Logo -->
<p align="center">
  <img height="128" width="128" src="https://github.com/cerner/terra-toolkit/raw/main/terra.png">
</p>

<!-- Name -->
<h1 align="center">
  Terra Toolkit
</h1>

[![License](https://badgen.net/github/license/cerner/terra-toolkit)](https://github.com/cerner/terra-toolkit/blob/main/LICENSE)
[![Build Status](https://badgen.net/travis/cerner/terra-toolkit)](https://travis-ci.com/cerner/terra-toolkit)
[![Dependencies status](https://badgen.net/david/dep/cerner/terra-toolkit)](https://david-dm.org/cerner/terra-toolkit)
[![devDependencies status](https://badgen.net/david/dev/cerner/terra-toolkit)](https://david-dm.org/cerner/terra-toolkit?type=dev)
[![lerna](https://badgen.net/badge/maintained%20with/lerna/cc00ff)](https://lerna.js.org/)

Terra Toolkit is a [Lerna](https://github.com/lerna/lerna) repository for common development packages necessary for developing Terra projects.

- [Notice](#notice)
- [Package Status](#package-status)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [LICENSE](#license)

## Notice

The code for the [terra-toolkit](https://www.npmjs.com/package/terra-toolkit) npm dependency has been moved to [terra-toolkit-boneyard](https://github.com/cerner/terra-toolkit-boneyard).

## Package Status

![Stable](https://badgen.net/badge/status/Stable/green)
![Beta](https://badgen.net/badge/status/Beta/orange)
![Deprecated](https://badgen.net/badge/status/Deprecated/grey)

| Package | Version | Status | Dependencies |
|---------|---------|--------|--------------|
| [@cerner/browserslist-config-terra](https://github.com/cerner/terra-toolkit/tree/main/packages/browserslist-config-terra) | [![NPM version](https://badgen.net/npm/v/@cerner/browserslist-config-terra)](https://www.npmjs.org/package/@cerner/browserslist-config-terra) | ![Stable](https://badgen.net/badge/status/Stable/green) | [![@cerner/browserslist-config-terra](https://badgen.net/david/dep/cerner/terra-toolkit/packages/browserslist-config-terra)](https://david-dm.org/cerner/terra-toolkit?path=packages/browserslist-config-terra) |
| [@cerner/eslint-config-terra](https://github.com/cerner/terra-toolkit/tree/main/packages/eslint-config-terra) | [![NPM version](https://badgen.net/npm/v/@cerner/eslint-config-terra)](https://www.npmjs.org/package/@cerner/eslint-config-terra) | ![Stable](https://badgen.net/badge/status/Stable/green) | [![@cerner/eslint-config-terra](https://badgen.net/david/dep/cerner/terra-toolkit/packages/eslint-config-terra)](https://david-dm.org/cerner/terra-toolkit?path=packages/eslint-config-terra) |
| [@cerner/terra-functional-testing](https://github.com/cerner/terra-toolkit/tree/main/packages/terra-functional-testing) | [![NPM version](https://badgen.net/npm/v/@cerner/terra-functional-testing)](https://www.npmjs.org/package/@cerner/terra-functional-testing) | ![Stable](https://badgen.net/badge/status/Stable/green) | [![@cerner/terra-functional-testing](https://badgen.net/david/dep/cerner/terra-toolkit/packages/terra-functional-testing)](https://david-dm.org/cerner/terra-toolkit?path=packages/terra-functional-testing) |

## Versioning

Terra-toolkit packages are considered to be stable and will follow [SemVer](http://semver.org/) for versioning.
1. MAJOR versions represent breaking changes
2. MINOR versions represent added functionality in a backwards-compatible manner
3. PATCH versions represent backwards-compatible bug fixes

Consult the component CHANGELOGs, related issues, and PRs for more information.

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for issue reporting and pull requests.

## LICENSE

Copyright 2017 - 2020 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

[@terra-core]: https://github.com/cerner/terra-core
[@terra-clinical]: https://github.com/cerner/terra-clinical
[@terra-framework]: https://github.com/cerner/terra-framework
[@terra-dev-site]: https://github.com/cerner/terra-dev-site
