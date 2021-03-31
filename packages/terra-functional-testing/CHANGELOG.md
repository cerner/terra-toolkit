# Changelog

## Unreleased

## 1.0.4 - (March 29, 2021)

* Fixed
  * Fixed packageName in terra-functional-testing for output files

* Added
  * Added a main index file to export the wdio.conf.js configuration file
  * Error screenshot functionality.

* Removed
  * Removed log message for out of range elements in screenshot because there are valid cases to have out of range elements.

## 1.0.3 - (March 23, 2021)

* Added
  * Added describeTests helper to filter tests by form factors, locales, or themes

* Changed
  * Throw error with a more meaningful message when an invalid selector is used to capture screenshot.

* Fixed
  * Fix endY/endX out of range error when selector element is larger than document size.

## 1.0.2 - (March 9, 2021)

* Fixed
  * Fix seleniumVersion service option to be read from serviceOptions instead of launcherOptions

## 1.0.1 - (March 1, 2021)

* Fixed
  * Correctly pass theme as `defaultTheme` to webpack-config-terra to run tests in the correct theme.

## 1.0.0 - (February 25, 2021)

* Initial stable release
