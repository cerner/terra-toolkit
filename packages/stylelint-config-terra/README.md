<!-- Logo -->
<p align="center">
  <img height="128" width="128" src="https://github.com/cerner/stylelint-config-terra/raw/main/terra.png">
</p>

<!-- Name -->
<h1 align="center">
  Terra Stylelint Shared Config
</h1>

[![NPM version](https://badgen.net/npm/v/stylelint-config-terra)](https://www.npmjs.org/package/stylelint-config-terra)
[![License](https://badgen.net/github/license/cerner/stylelint-config-terra)](https://github.com/cerner/stylelint-config-terra/blob/main/LICENSE)
[![Build Status](https://badgen.net/travis/cerner/stylelint-config-terra)](https://travis-ci.com/cerner/stylelint-config-terra)
[![Dependencies status](https://badgen.net/david/dep/cerner/stylelint-config-terra)](https://david-dm.org/cerner/stylelint-config-terra)
[![devDependencies status](https://badgen.net/david/dev/cerner/stylelint-config-terra)](https://david-dm.org/cerner/stylelint-config-terra?type=dev)


This configuration reflects Terra's supported stylelint policy for their UI library stylesheets. It extends the  [stylelint-config-sass-guidelines](https://github.com/bjankord/stylelint-config-sass-guidelines) configuration which is based on [sass-guidelines](https://sass-guidelin.es/). Additionally, this configuration utilizes the [stylelint-no-unsupported-browser-features](https://github.com/ismay/stylelint-no-unsupported-browser-features) plugin to check if the styles used are supported by the browsers being targeted. Terra's targeted browsers are specified by the [browserslist-config-terra](https://github.com/cerner/browserslist-config-terra) module.

## What is Stylelint?

[Stylelint](https://stylelint.io/) is a mighty, modern CSS linter and fixer that helps you avoid errors and enforce consistent conventions in your stylesheets.


## Installation

Install the module

```shell
$ npm install stylelint --save-dev
$ npm install stylelint-config-terra --save-dev
```

## Usage

### package.json

```json
{
  "stylelint": {
    "extends": "stylelint-config-terra"
  }
}
```

### Extending Terra's Configuration
It is possible to specify and override the rules defined by stylelint-config-terra. Read more about it [here](https://stylelint.io/user-guide/configuration/#extends).

For example, it is possible to override the browsers specified to the no-unsupported-browser-features plugin.

```json
{
  "stylelint": {
    "extends stylelint-config-terra",
    "rules": {
      "plugin/no-unsupported-browser-features": [
        true,
        "browsers": ["iOS >= 10"],
        "severity": "warning",
      ]
    }
  }
}
```

## Custom Lint Rules

The following custom rules are enabled by default.

* [terra/custom-property-name](https://github.com/cerner/stylelint-config-terra/blob/main/lib/rules/custom-property-name): Requires custom properties to be suffixed with the css property name.
* [terra/custom-property-namespace](https://github.com/cerner/stylelint-config-terra/blob/main/lib/rules/custom-property-namespace): Requires custom properties to be prefixed with a namespace.
* [terra/custom-property-pattern](https://github.com/cerner/stylelint-config-terra/blob/main/lib/rules/custom-property-pattern): Requires custom properties to be written in lowercase alphanumeric characters and hyphens.
* [terra/custom-property-pseudo-selectors](https://github.com/cerner/stylelint-config-terra/blob/main/lib/rules/custom-property-pseudo-selectors): Requires custom properties to include all ancestor pseudo selectors in order.

## Versioning

stylelint-config-terra is considered to be stable and will follow [SemVer](http://semver.org/) for versioning.
1. MAJOR versions represent breaking changes
2. MINOR versions represent added functionality in a backwards-compatible manner
3. PATCH versions represent backwards-compatible bug fixes

Consult the component CHANGELOGs, related issues, and PRs for more information.

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for issue reporting and pull requests.

## LICENSE

Copyright 2018 - 2020 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
