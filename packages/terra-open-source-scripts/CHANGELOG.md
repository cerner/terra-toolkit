# Changelog

## Unreleased

* Fixed
  * Fix issue with the stdio buffers running out of space on calls to exec by switching to spawn instead
  * Fix issue with spawn commands and quoted arguments. Spawn bypasses the shell so no need to quote strings

## 1.0.1 - (November 17, 2020)

* Fixed
  * Fix issue with setting up git on publish

## 1.0.0 - (November 17, 2020)

* Initial stable release
