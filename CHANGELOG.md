Changelog
=========

Unreleased
----------

5.13.0 - (November 7, 2019)
----------
### Added
* Tap into the `failed` webpack compiler hook to exit the wdio test runner when compilation fails.

5.12.0 - (October 30, 2019)
----------
### Changed
* Unlocked the version of postcss from "v7.0.18" to "v7.0.21".

5.11.0 - (October 25, 2019)
----------
### Fixed
* Lock down postcss dependency to v7.0.18

### Added
* Added DefinePlugin to webpack configuration to globally define webpack execution timestamp.

5.10.0 - (October 3, 2019)
----------
### Changed
* Upgraded the version of css-loader from "v2.1.1" to "v3.2.0".

5.9.0 - (September 19, 2019)
----------
### Fixed
* Guard against empty scope value passed by theme config.

5.8.0 - (September 16, 2019)
----------
### Fixed
* Resolve issues with theme files within node modules being aggregated multiple times.
### Changed
* Revert change to webpack range from "webpack": "^4.30.0" to "webpack": ">=4.30.0 <4.40.0"

5.7.1 - (September 12, 2019)
----------
### Fixed
* Fixed issue with theme aggregation where the default theme wasn't honored

5.7.0 - (September 12, 2019)
----------
### Added
* Added a post-install console warning if terra-toolkit is included as a hard dependency
* Fallback theme generation strategy for theme aggregation.
* Theme visual regression support.

### Changed
* Updated webpack range from "webpack": "^4.30.0" to "webpack": ">=4.30.0 <4.40.0" to avoid consuming buggy behavior in webpack 4.40.0

5.6.2 - (September 6, 2019)
----------
### Fixed
* Reverted post-install console warning if terra-toolkit is included as a hard dependency

5.6.1 - (September 5, 2019)
----------
### Added
* Added a post-install console warning if terra-toolkit is included as a hard dependency
* Added a line to webpack config to only resolve to 'main'

5.6.0 - (August 30, 2019)
----------
### Added
* Add functionality to support theming with code splitting in IE

### Changed
* Give webpack plugins a chance to manipulate devServer options.

5.5.0 - (August 21, 2019)
----------
### Added
* Added chunk filename support

### Changed
* Updated Object.assign syntax to Object spread syntax

5.4.0 - (July 31, 2019)
----------
### Added
* Added test helper to hide a blinking input caret in an element
* The WDIO TerraService automatically hides carets in the page whenever a page is loaded or refreshed

5.3.0 - (July 25, 2019)
----------
### Changed
* Upgraded mini extract text plugin
* Ignore css order warnings from mini extract text plugin
* Upgraded terra-node to node 10
* Update postcss-custom-properties package to latest release
* Improve afterCommand error handling

5.2.0 - (July 9, 2019)
----------
### Added
* After command to help passivity for a code split dev site.

### Fixed
* Stop gracefully when using Ctrl-C to kill the wdio-runner

### Changed
* Pin axe-core version to 3.2.2

5.1.0 - (June 25, 2019)
----------
### Added
* Added selenium/firefox-node to local docker-compose test setup
* Added support for hitting an external selenium grid url
* Added firefox and internet explorer browser capabilities
* tt-wdio: added `--gridUrl` and `--browsers` options
* Added default terra.selector of `[data-terra-dev-site-content] *:first-child` to wdio configuration
* v5 upgrade guide

### Changed
* Updated clean-webpack-plugin dependency. Webpack config and jest test syntax updated to reflect v3 import changes, see https://github.com/johnagan/clean-webpack-plugin/releases/tag/v3.0.0
* Updated file-loader dependency, requires node >= 8.9.0 (.nvmrc version is > 8.9.0)
* Updated raw-loader dependency, requires node >= 8.9.0 (.nvmrc version is > 8.9.0)
* Update danger dev-dependency
* Add wcag2a and wcag21aa rules to axe-core check
* Increase wdio timeout and mocha timeouts to be 1200000
* Changed duplicate-package-checker-webpack-plugin dependency and added strict duplicate detection for version-sensitive packages.
* Removed aliases for version-sensitive packages.

### Fixed
* Update serve-static site directory check to to ensure it serves a site directory that has content

### Removed
* Removed shelljs dependency to resolve potential security vulnerability issue. Updated scripts/pack/pack.js to use node child_process and file system commands.

5.0.0 - (May 31, 2019)
----------
### Major Version Bump.

### Changed
* **Breaking Change** Upgrade to use selenium-docker chrome version 3.14.0-helium. Tests now run against Google Chrome: 69.0.3497.100. See https://github.com/SeleniumHQ/docker-selenium/tree/3.14.0-helium
* Updated dependencies and dev dependencies to their latest version (with the exception of webdriverio)
* Change the following dependencies to peer dependencies: webpack, webpack-cli, webpack-dev-server, raf

### Added
* **Breaking Change** Added `resetScroll: true` to axe helper.
* Added the following peer dependencies: @babel/core, @babel/cli, core-js
* Added `SITE` env to wdio configuration for serving and testing pre-compiled static content
* Added webpack-dev-server configuration in the webpack configuration to disable hot reloading with `--env.disableHotReloading`

### Changes
* Moved/reduced redundant code that parsed the test options passed to TerraService test helpers

### Fixed
* **Breaking Change** Fix inconsistent screenshot widths for the huge form factor by setting the default formFactor to 'huge' in the wdio.config.js. [#137](https://github.com/cerner/terra-toolkit/issues/137)
* **Breaking Change** Fix incorrect screenshot naming where the screenshot name by using the current viewport size's form factor instead of using the formFactor value set in wdio.config.js.[#248](https://github.com/cerner/terra-toolkit/issues/248)

### Removed
* **Breaking Change** Removed the nightwatch utility, dependencies, tests and documentations.
* **Breaking Change** Aggregate-translations pre-build script and default terraI18n configuration is no longer provided through terra-toolkit.
* **Breaking Change** Deprecated serve javascript function
* **Breaking Change** Serve-static no longer builds webpack config
* **Breaking Change** Serve-static no longer injects locale.
* **Breaking Change** Removed Axe Service. The Axe Service functionally was moved to the Terra Service.
* Terra Service:
  * **Breaking Change** Removed Terra.should test helpers. There is no replacement for Terra.should.themeEachCustomProperty and Terra.should.themeCombinationOfCustomProperties
  * **Breaking Change** Terra.it.isAccessible (previously Terra.should.beAccessible) no longer accept context as a test option but instead always use `document`
  * **Breaking Change** Removed `runOnly` option from Terra.should.beAccessible test helper and axe chai method
  * **Breaking Change** Removed `isExactMatch` chai assertion.
  * **Breaking Change** Removed `viewportChangePause` test option from Terra.it.matchesScreenshot (previously Terra.should.matchScreenshot) test helper

4.29.0 - (May 30, 2019)
----------
### Added
* Added `Terra.it` Mocha-chai it block test methods in the Terra Service to eventually replace `Terra.should`
* Added `Terra.validates` chai assertion methods in the Terra Service to used in Mocha it blocks
* Added `Terra.describeViewports` Mocha describe block methods in the Terra Service as a convenience for setting up test viewport looping

4.28.1 - (May 17, 2019)
----------
### Fixed
* use terra-toolkit's default locales since terra-aggregate-translations doesn't support ar

4.28.0 - (May 16, 2019)
----------
### Added
* Added default testName `themed` for `themeCombinationOfCustomProperties` helper.
* Added `terra-aggregate-translations` module
* Guard against empty screenshot array being passed to `getComparisonResults`.

### Changed
* Remove rimraf dev-dependency
* Remove scripts/release script and update package.json scripts to reflect release script
* Webpack configuration:
    * Added css compression for production webpack builds with cssnano
    * Remove directly passing browserslist configuration to webpack. Use package defined configuraiton instead.
    * Updated dependencies
    * Changed webpack, webpack-cli and webpack-dev-server to be peer dependencies to ensure correct versions are used

### Removed
* Aggregate-translation script, tests, and bin executable

4.27.0 - (April 16, 2019)
----------
### Added
* Added an environment variable `WDIO_BAIL` to support WebdriverIO's bail option.

### Changed
* Updated devtool sourceMap from cheap-source-map to eval-source-map

4.26.0 - (March 20, 2019)
----------
### Added
* Added a new method `validateElement` to both do a screenshot comparison and test accessibility
* Log information on what selenium version is being used for the test run.

### Fixed
* Fixed the issue with Aggregate Translations CLI default options overriding the configuration file options.
* Fixed an issue with the 'exclude' option in Aggregate Translations setup function. [#264](https://github.com/cerner/terra-toolkit/issues/264)

4.25.0 - (March 5, 2019)
----------
### Fixed
* Issue with false warnings on aggregating translations with blank strings.

4.24.0 - (March 5, 2019)
----------
### Changed
* Updated aggregate translations script fallback to base locale if translation is missing for regional locale on a string-by-string basis.

### Added
* Added a script to aggregate dependency themes into a single file
* Add en-AU to supported translations list

4.23.1 - (February 5, 2019)
----------
### Fixed
* Issue with duplicate-package-checker-webpack-plugin being listed as a devDependency

4.23.0 - (February 5, 2019)
----------
### Added
* Added format option to aggregate-translations to output modern syntax
* Added the Duplicate Package Checker Plugin to the default webpack config. The duplicate package checker plugin will warn if duplicate packages (different versions) are included in your webpack bundle.
* Added formatted & colored console output for toolkit services and scripts

### Changed
* Update the `connectionRetryCount` to 1 in the default wdio configuraiton

### Fixed
* Adjust AxeService implementation to only resize the viewport if viewport options are passed.

4.22.0 - (January 2, 2019)
----------
### Changed
* Updated docs to have logically nested headers.

4.21.0 - (December 14, 2018)
----------
### Added
* Add exclude directories option to aggregate translations tool
* Add local and network address display to tt-serve
* Add glob option to follow symlinked node_modules while aggregating translations

### Changed
* Opened up default search patterns to search all first-, second- and third-level `node_module/*/translations` patterns for monorepos and non-monorepos instead of the first-level `node_modules/terra-*/translations` patterns.

4.20.0 - (December 6, 2018)
----------
### Changed
* Upgraded webpack-cli to 3.0.0 and unlocked webpack version.

### Changed
* Aggregrate-translations tool now outputs pre-compiled translations jsons, intl loaders and translations loaders to prevent the need for the compilation during webpack. This resolves SCRIPT1002: Syntax error with IE.

4.19.0 - (November 20, 2018)
----------
### Changed
* Added configuration option (disableThemeTests) to disable theme functions in wdio tests

4.18.0 - (November 19, 2018)
----------
### Changed
* Replaced uglifyjs-webpack-plugin with terser-webpack-plugin

4.17.0 - (November 14, 2018)
----------
### Changed
* Loosen node version via npm engine to accept any version over 8.9.2
* Update .npmrc file to use latest v8.x release (lts/carbon)

4.16.1 - (November 13, 2018)
----------
### Fixed
* Remove parseInt for serve-cli port value. Casting it to a number caused the default value to return NaN.

4.16.0 - (November 9, 2018)
----------
### Added
* Added `site` wdio configuration option such that a relative path to a static site can used in the ServeStatic service. This option can be utilized to speed up tt-wdio runs by removing duplicated webpack compilation.
* Added `tt-pack` script for packing packages into a tar archive file.

### Fixed
* Cast serve-cli port value to be a number to prevent NaN from being passed as the port value for the server.

### Changed
* Give more info on webpack mode in serve-static startup

4.15.0 - (October 23, 2018)
----------
### Added
* Add pause to the Terra service setup for IE browsers when setting the viewport. IE browsers need more time before being interacted with.

### Fixed
* Updated test suite determination logic to prevent empty test suites from being created.

4.14.0 - (October 16, 2018)
----------
### Removed
* Lerna dependency

### Changed
* Switch back to using webpack-dev-server for tt-serve due to webpack deprecating webpack-serve in favor of webpack-dev-server.


4.13.0 - (October 8, 2018)
----------
### Changed
* Updated aggregated translation loader to load translations relative to generated translations directory

4.12.0 - (September 25, 2018)
----------
### Changed
* Updated linter and linter plugins
* Locked webpack version to 4.19.0

4.11.1 - (August 29, 2018)
----------
### Changed
* Pinned version of axe-core to 3.0.3

4.11.0 - (August 29, 2018)
----------
### Changed
* Bump axe-core to ^3.1.1 and unpin the version
* Fixed wdio clean-screenshots utility incorrectly resolving path of config file

4.10.1 - (August 27, 2018)
----------
### Changed
* Pinned version of axe-core to 3.0.3

4.10.0 - (August 21, 2018)
----------
### Changed
* Bumped node-sass dependency to v4.9.3. This version should work better on latest High Sierra OS on mac.
* Fixed aggregated-translations locales and tt-wdio formFactors and locales flag to not include single quotes in output file names on Windows.

4.9.0 - (August 14, 2018)
----------
### Fixed
* Updated the default output public path to align with webpack's default

4.8.0 - (August 13, 2018)
----------
### Added
* Accept 'output-filename', 'output-path' and 'output-public-path' webpack cli argv options to be passed into configuration.

### Change
* Extend file-loader to load otf, eot, ttf, svg, woff, woff2 font files

### Fixed
* Set devTool to undefined when in production mode
* Fixed issue with aggregated-translations CLI parsing directories - https://github.com/cerner/terra-toolkit/issues/148

4.7.0 - (August 1, 2018)
----------
### Fixed
* Updated the `baseScreenshotDir` option to allow for test reusability from terra repositories
* Pass clean-screenshot CLI flags to the wdio clean-screenshot tool

4.6.0 - (July 25, 2018)
----------
### Added
* Added sv and sv-SE to aggregated translations supported locales list

### Fixed
* Only hash css assets in production mode for webpack config reusability in rails projects.

4.5.0 - (July 20, 2018)
----------
### Fixed
* Added a start static script that is just for heroku builds.

4.4.0 - (July 18, 2018)
----------
### Changed
* Removed the environment variable for port from static and static-serve

4.3.0 - (July 17, 2018)
----------
### Changed
* Updated the static and static-serve CLI's to default `0.0.0.0` for the host

### Fixed
* Set the viewport size before test run when formFactor is defined for viewport-unopinionated tests.

4.2.0 - (July 6, 2018)
----------
### Fixed
- Issue with containerized test runs.  Allows for port mapping of an internal port on the container to an external port on the container.

4.1.0 - (July 3, 2018)
----------
### Fixed
- Serve-static script to serve non-html files "as is". Fixed issues with images not rendering.

4.0.0 - (June 26, 2018)
----------
### Major Version Bump. See https://github.com/cerner/terra-toolkit/blob/master/docs/guides/UpgradeGuide-v4.0.0.md.

### Added
* Added `locale`, `formFactor` and `baseScreenshotDir` wdio.config options for i18n support [#69](https://github.com/cerner/terra-toolkit/issues/69) and parallelization support [#70](https://github.com/cerner/terra-toolkit/issues/70)
* Added tt-wdio bin script called `tt-wdio` which runs wdio test runs for the specified locales and form factors
* Added clean-screenshots bin script called `tt-clean-screenshot` [#64](https://github.com/cerner/terra-toolkit/issues/64)

### Changed
* **BREAKING CHANGE** Update screenshot naming to organize screenshots by locale and form factor
    - changed `screen` directory name to `latest`
    - added automatic screenshot name shortening to allow for descriptive describes, but short screenshot names.
    - ensure screenshot naming does not contain Windows
* **BREAKING CHANGE** Bumped dependencies.
* Update the default webpack.config's Autoprefixer's browserslist values

### Fixed
* **BREAKING CHANGE** Changed bin scripts from `tt:script_name` to `tt-script_name`. The use of `:` breaks Windows. See https://msdn.microsoft.com/en-us/library/ms832054.aspx. [#96](https://github.com/cerner/terra-toolkit/issues/96)
* Dependency issues seen from using css-loader's minimize option in the production webpack configuration which impacted long-hand CSS properties using CSS custom properties and caused issues with browserlist syntax. [#121](https://github.com/cerner/terra-toolkit/issues/121)

3.9.0 - (June 19, 2018)
----------
### Changed
* Changed path to use POSIX for SelemiumDockerService to fix Windows issue.

3.8.0 - (June 15, 2018)
----------
### Fixed
* Allow serving static assets when they're requested using query params

### Changed
* Reduce log output for tt-serve (no children)

3.7.0 - (June 12, 2018)
----------
### Updated
* PostCSS/UglifyJS corrections

3.6.0 - (June 5, 2018)
----------
### Updated
* tt:serve and tt:serve-static now take a --host option.
* Removed the exception to transpile terra-dev-site.

3.5.0 - (May 22, 2018)
----------
### Updated
* Documentation updates
* Build improvements

3.4.0 - (May 17, 2018)
----------
### Fixed
* Re-enabale cheap-source-map, the source mapping level we had prior to webpack 4.

### Updated
* Improved caching during travis builds
* Improved suite generation for lerna projects

3.3.1 - (May 4, 2018)
----------
### Fixed
* Remove './' from bin paths in package.json

3.3.0 - (May 15, 2018)
----------
### Added
* Created ion-node docker image that can be used by terra repos during builds
* Added a ci docker compose file that will be used during travis parallel builds

### Updated
* Updated the wdio config for lerna projects to create a set of suites that can be used when running tests

3.2.1 - (May 4, 2018)
----------
### Fixed
* Remove './' from bin paths in package.json

3.2.0 - (April 26, 2018)
----------
### Changed
* Increase the timeout waiting for the selenium docker service to start.

3.1.1 - (April 25, 2018)
----------
### Fixed
* Lock into a specific version of chrome driver.

3.1.0 - (April 25, 2018)
----------
### Changed
* WDIO bails at the first failure when running on CI.

### Fixed
* set a default browser size explicitly.

### Added
* Added documentation on the aggregated-translations tool
* Added services.default-config to quickly reference the default values used by the wdio services

3.0.1 - (April 24, 2018)
----------
### Fixed
* Removed disabled axe 'landmark-one-main' rule from the provided default wdio.config

3.0.0 - (April 19, 2018)
----------
### Major Version Bump. See https://github.com/cerner/terra-toolkit/blob/master/docs/guides/UpgradeGuide-v3.0.0.md.

### Added
* Added nl and nl-BE to supported locales

2.11.0 - (April 11, 2018)
----------
### Added
* Added themeCombinationOfCustomProperties method to Terra WDIO service.

### Changed
* Improved error logging for the Express Dev Server Service.

2.10.0 - (April 10, 2018)
----------
### Changed
* Reduced testing webpack config to the bare minimum needed.
* Nightwatch now uses the Express Dev Server Service.
* Express Dev Server Service now fails silently for '/favicon.ico' routes when no favicon exists.
* Updated to use 3.11 of chromedriver

2.9.1 - (March 22, 2018)
----------
### Fixed
* Rolled back the number of max selenium instances from 5 to 1 because of a bug in selenium.

2.9.0 - (March 13, 2018)
----------
### Added
* Added deprecation warning when using Nightwatch.
* New Express Dev Server Service for running tests against. Webpack-dev-server is in [maintenance mode](https://github.com/webpack/webpack-dev-server#project-in-maintenance).

### Fixed
* Bumped up the wdio timeout to account for long running screenshot comparisons.

2.8.1 - (February 23, 2018)
----------
### Fixed
* Fixed the Terra.matchScreenshot setup to correctly create and compare screenshots for multiple viewports.

2.8.0 - (February 20, 2018)
----------
### Added
* Add global should reference to chai should
* Expanded Terra.matchScreenshot to include the wdio-visual-regression-service capture screenshot options of `misMatchTolerance` and `viewportChangePause` to allow for custom test step values.

### Changed
* Enhanced the mocha-chai helper to be more descriptive and to iterate each viewport option for better test failure information
* For the chai assertion method `matchReference`
    * Enhanced error message to be more descriptive for fail assertion
    * Include screenshot compare results for fail assertion
    * Accepts matchType to make assertion on comparison results to be withinTolerance or to be the exact image. Defaults to 'withinTolerance'. Previous behavior only checked for exact image and did not account for globally defined misMatchTolerance value.


2.7.0 - (January 29, 2018)
----------
* Locked down docker selenium chrome version
* Removed unneeded React dependencies
* Add selector argument to themeEachCustomProperty method
* Add a default global document selector to the wdio config which is used in the Terra service
* Unlock axe-core to version ^2.6.1

2.6.0 - (January 4, 2018)
----------
* Log reduced nightwatch output when running in CI.

2.5.0 - (January 3, 2018)
----------
* Lock axe-core to version 2.5

2.4.0 - (December 12, 2017)
------------------
* Lock webpack-dev-server at latest version that supported IE10 (2.7.1)

2.3.0 - (November 30, 2017)
------------------
### Added
* Added WebpackDevServerService to webdriver.io services

### Updated
* Updated nightwatch to use WebpackDevServerService
* Updated tests to use WebpackDevServerService instead of 'wdio-static-server'

2.2.0 - (November 15, 2017)
------------------
### Changed
* Use path.join to allow for Windows development
* Removed sauce labs config and install java 8 in a different way for travis ci
* Added webdriver.io testing utilities
* Update nightwatch to use docker

2.1.0 - (October 5, 2017)
------------------
### Changed
* Refactored dependencies to make webpack and nightwatch peer dependencies.

2.0.0 - (August 31, 2017)
------------------
### Changed
* Nighwatch configuration is now available via a single file which allowed for the removal of the testSetting module. Configuration can now be created  by providing the webpack configuration, test folders and (optional) port number to the nightwatchConfig function.

## Added
* Added responsive nightwatch test helper functions. Functions include 1. resizeTo and 2. screenWidth.
1. resizeTo: Allows for breakpoint specification within the test suite and handles browser resizing function to allow for test to be run across each breakpoint specified.
2. screenWidth: returns the screen width grabbing the breakpoint tag specified within the current test description.

### Removed
* Removed screenshot capabilities
* Removed sauce capabilities
* Removed spectre capabilties
* Removed nightwatch test scripts
* Removed default webpack configuration

1.2.2 - (July 14, 2017)
------------------
### Changes
* Update output of aggregated translations to be placed within the site package for testing

1.2.1 - (July 13, 2017)
------------------
### Changes
* Change permission to 755 on executable scripts

1.2.0 - (July 13, 2017)
------------------
### Changes
* Remove post-install script which caused installation failure

1.1.0 - (June 28, 2017)
------------------
### Dependency Additions/Updates
* The following changes removed any coupling to the terra-core repository. Additionally, default configuration was added to webpack and nightwatch setup to remove the need for any nightwatch testing configuration at package level for terra components.
* Added webpack.config.js and nightwatch.conf.js files. These provides a default test setup for the nightwatch scripts. The webpack config file assumes package-level testing with examples living within the 'repo_name'-site package.
* Updated "globals_path" in nightwatch.json to assume package-level testing.
* Updated README to include versioning and added more explanation regarding toolkit abilities.

1.0.0 - (June 28, 2017)
------------------
Initial stable release
