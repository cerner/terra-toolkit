# Terra Toolkit Upgrade Guide v4.0.0
This document will provide information on upgrading from terra-toolkit 3.x to 4.0.0.

## Terra Scripts
The scripts provided by Terra Toolkit v3 used `tt:` prefixes. It was found `:` causes incorrect .bin generation on Windows devices so these scripts have been updated to use the prefix `tt-`.
```diff
-    "aggregate-translations": "tt:aggregate-translations",
+    "aggregate-translations": "tt-aggregate-translations",
-    "start": "tt:serve",
+    "start": "tt-serve",
-    "start-static": "tt:serve-static",
+    "start-static": "tt-serve-static",
```
### Serve
The `webpack-serve` dependency was updated from `^0.3.1` to `^1.0.2`.

### Wdio Runner
Terra Toolkit now offers its own wdio test runner which runs wdio test runs for specified locales and form factors. This allows for locale test runs that can match parallelized container test runs by concurrently running the wdio for each test run variation. This runner is a replacement for webdriver's bin script `wdio` by directly calling Webdriver's test launcher module for each test variation.

Terra's wdio test runner is available via the `tt-wdio` cli or the `wdio-runner` javascript function.

### Clean Screenshots
Terra Toolkit now offers a screenshot cleanup tool to remove `errorScreenshots`, `latest`, `diff` and, if indicated, `reference` screenshots.

This is available via the `tt-clean-screenshots` cli or the `clean-screenshots` javascript function.

###### For more information about terra-wdio and clean-screenshots and for setup examples please go [here](https://github.com/cerner/terra-toolkit/tree/master/scripts/wdio).


## Webpack Configuration
### Configuration Changes
The browsers list provided to the Autoprefixer plugin were updated use `browserslist-config-terra`'s list of targeted browsers. This configuration includes:
- iOS >= 10
- last 2 and_chr versions
- last 2 android versions
- last 2 chrome versions
- last 2 edge versions
- last 2 firefox versions
- last 2 ie versions
- last 2 safari versions

For prod compilation, css is no longer minimized via the `css-loader`. There were several issues caused by dependency collision. Discussion can be found [here](https://github.com/cerner/terra-toolkit/issues/121). If you are not using terra's default webpack configuration as the base webpack config, it is highly recommended to disable minimize.

### Dependencies Updates
The following dependencies were updated in Terra toolkit's default webpack configuration:

- autoprefixer: `^6.7.7` -> `^8.5.2`
- load-json-file: `^2.0.0` -> `^5.0.0`
- postcss-assets-webpack-plugin: `^1.1.0` -> `^2.0.0`
- postcss-custom-properties: `^6.0.1` -> `^7.0.0`
- sass-loader: `^6.0.6` -> `^7.0.1`

## WebdriverIO
Terra Toolkit's configuration and services now have i18n and parallelization support. These include new config options, as well as changes to screenshot naming to organize screenshots by locale and form factor.

### WebdriverIO Configuration
The following configuration options were added:
- `locale` - the locale to serve the site in. By default this is `en`.
- `formFactor` - the terra viewport for the test run. By default, the viewport is determined the current browser size.
- `baseScreenshotDir` - where snapshots are stored. By default, this will be the test-spec directory.

No updates are required with the addition of the config options.

#### Screenshot Naming
The default visual-regression configuration was enhanced to organize screenshots by locale and form factor. These enhancements were:

1) The updated screenshot pattern is:

```
{reference|latest|diff}/locale/browser_formFactor/testSuite/describeBlockTitle[screenshotName].png
```

2. The screenshot output directory name `screen` was changed to `latest` to remove confusion about which directory contains the most recent screenshot(s) taken.

3. Screenshot names will now be shortened to allow for descriptive describes when `[]`s are around the desired key word(s). For example:
```
// example-spec.js
const viewports = Terra.getViewports('tiny');
describe('This is a long screenshot name for an [example test], () => {
    Terra.should.matchScreenshot({ viewports });
});

// v4 screenshot result
reference/en/chrome_tiny/example/example_test[default].png

// v3 screenshot result
reference/chrome/This_is_a_long_screenshot_name_for_an_[example_test][default].470x768.png
```

4. Screenshot names will now remove Windows reserve character to prevent installation failures.

##### How to Get These Changes
1. Delete your reference screenshots
2. Run your wdio tests
3. Add `**/wdio/__snapshots__/latest` to your `.gitignore`

**NOTE:** The default visual-regression config file has moved from `terra-toolkit/lib/wdio/visualRegressionConf.js` to `terra-toolkit/config/wdio/visualRegressionConf.js`. This change was made to provide a consistent location for our reusable configuration files.

### AxeService
The `axe-core` dependency was updated from `^2.6.1` to `^3.0.2`.
