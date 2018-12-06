Changelog
=========

Unreleased
----------

4.20.0 - (December 6, 2018)
----------
### Changed
* Upgraded webpack-cli to 3.0.0 and unlocked webpack version.

### Changed
* Aggregrate-translations tool now outputs pre-compiled tranlstaions jsons, intl loaders and translations loaders to prevent the need for the compilation during webpack. This resolves SCRIPT1002: Syntax error with IE.

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
* Only hash css assets in proudction mode for webpack config reusability in rails projects.

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
### Major Version Bump. See https://github.com/cerner/terra-toolkit/blob/master/docs/TerraToolkitUpgradeGuide-v4.0.0.md.

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
### Major Version Bump. See https://github.com/cerner/terra-toolkit/blob/master/docs/TerraToolkitUpgradeBuid-v3.0.0.md.

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
