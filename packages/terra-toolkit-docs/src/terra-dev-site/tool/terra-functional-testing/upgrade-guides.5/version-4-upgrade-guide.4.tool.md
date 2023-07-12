# Terra Functional Testing - Version 4 Upgrade Guide

To upgrade to `terra-functional-testing` from v3 to v4, consumers will need to rerun their WDIO tests to generate new reference screenshots for all themes. This can be done by running the WDIO command with the `--updateScreenshots` flag.

## Breaking Changes

The docker image used for WDIO testing has been upgraded to be compatible with Apple Sillicon devices. However, the chromium version being tested on has been updated. The new chromium version has styling changes that affect the focus indicator and size of the testing environment -- therefore requiring consumers to generate new reference screenshots. 
