Changelog
=========

Unreleased
----------

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
