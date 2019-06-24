# Terra Toolkit Upgrade Guide v5 - Changes

This document will provide information on what changed from terra-toolkit 4.x to 5.x. This included dependency, functionality and technical changes that impact how you should use the terra-toolkit module. See Part 1 for step-by-step upgrade changes. See Part 2 for webdriver.io test changes.

## Webpack Configuration

### Configuration Changes

1. The browsers list provided to the Autoprefixer plugin no longer directly uses the `browserslist-config-terra`'s list of targeted browsers. Autoprefixer recommends including this list via a browserslist key to your package.json to configure all build tools with the same browsers list. Fixed [#110](https://github.com/cerner/terra-toolkit/issues/110).

    Add the `browserslist-config-terra` targeted browsers (or a custom list) to your package.json like:

```json
{
  "browserslist": [
    "extends browserslist-config-terra"
  ]
}
```

### Dependencies Changes

The following webpack dependency changes were made in Terra toolkit's default webpack configuration. Upgrading to use babel `^7` is required to use these dependency updates.

#### Dependency to Peer Dependencies

Terra recommends using the bins provided by these npm dependencies. To ensure you always have access to these bins and the correct versions, these are now defined as peer dependencies:

- webpack
- webpack-cli
- webpack-dev-server

The following dependencies are polyfills that must be included in the entry point. These are peer dependencies because they must be defined at the application level to ensure the correct version is pulled in:

- core-js
- raf
- regenerator-runtime

#### Updated

- autoprefixer: `^8.5.2` -> `^9.5.1`
- babel-loader: `^7.1.2` -> `^8.0.5` [* requires babel `^7`]
- clean-webpack-plugin: `^0.1.17` -> `^2.0.1`
- css-loader: `^0.28.7` -> `^2.1.1`
- file-loader: `^1.1.5` -> `^3.0.1`
- mini-css-extract-plugin: `^0.4.5` -> `^0.7.0`
- postcss: `^6.0.9` -> `^7.0.16`
- postcss-assets-webpack-plugin: `^2.0.0` -> `^3.0.0`
- postcss-custom-properties: `^7.0.0` -> `^8.0.10`
- postcss-loader: `^2.0.6` -> `^3.0.0`
- raw-loader: `^0.5.1` -> `^2.0.0`

#### Removed

- `browserslist-config-terra`
- `babel-polyfill` [this was deprecated and replaced with core-js and regenerator runtime]

## Terra Scripts

### Aggregate Translations

The aggregate-translations pre-build script and default terraI18n configuration is no longer provided through terra-toolkit. This being said, the default webpack configuration still runs the aggregate-translations pre-build script! For direct use of the aggregate-translations script or list of supported locales, update imports to reference the `terra-aggregate-translations` dependency:

```diff
- const aggregateTranslations = require('terra-toolkit/scripts/aggregate-translations/aggregate-translations');
+ const aggregateTranslations = require('terra-aggregate-translations');
- const i18nSupportedLocales = require('terra-toolkit/scripts/aggregate-translations/i18nSupportedLocales');
+ const aggregateTranslations = require('terra-aggregate-translations/config/i18nSupportedLocaels');
```

### Serve

Serve is now a thin abstraction on webpack dev server and the command line api is now identical. With this addition it now means that you have control over the dev server through options specified in your webpack config as well as through the cli.

Why use serve instead of webpack-dev-server directly? Having the serve abstraction provides a hook for us to change the servers implementation in case webpack-dev-server no longer meets our needs.

A webpack.config must be provided at the root level or passed in via `--config` flag in the package.json script. The webpack-dev-server cannot attempt to automatically load our defaults.

```diff
//package.json
scripts: {
-  "start": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js",
+  "start": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js",
+  "start-prod": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js -p --env.disableHotReloading",
}
```

Then, our default webpack config has been updated with the following defaults:

```javascript
module.exports = {
  devServer: {
    // We set the host this way to allow it to be served from docker containers.
    host: '0.0.0.0',
    publicPath: '/',
    // These options cut down on noise in the webpack build output.
    stats: {
      colors: true,
      children: false,
    },
  },
};
```

If you want to serve a non hot-reloading site without pre-building your site, use tt-serve with the `--env.disableHotReloading` flag passed via the cli.

```diff
scripts: {
+  "start-prod": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js -p --env.disableHotReloading",
}
```

Serve is no longer available as a javascript function. If this is needed use [webpack-dev-server](https://github.com/webpack/webpack-dev-server) directly.

### Serve Static

Webpack-dev-server now supports IE 10+, because of this serve-static will no longer run webpack to compile your assets. Serve static will now simply host static site content.

If an html page is not found, serve static will try to return `/404.html` with a status of 404. If that file is not found, serve-static will return a 404 status as before.

These api options have been removed from both the cli and javascript:

- config
- production
- disk

```diff
//package.json
scripts: {
+  "pack": "NODE_ENV=production webpack --config node_modules/terra-dev-site/config/webpack/webpack.config.js -p",
-  "start-static": "tt-serve-static -p",
+  "start-static": "npm run pack && tt-serve-static -p",
}
```

### Heroku Serve Static

This script was removed. Use this serve-static instead.

### Toolkit's Wdio Runner

This script now supports `--gridUrl` and `--browsers` flags. And should be used directly for locale and form testing. 

Also, the wdio configuration is no longer auto-magically loaded. It must be provided to both `wdio` and `tt-wdio` if a `wdio.config.js` file does not exist at the root level. 

## WebdriverIO

### Dependency Changes

- unlock `axe-core`: `3.0.3` -> `^3.0.2`.

### Configuration Changes
Below are changes that allow terra-toolkit's wdio configuration to be used directly. Terra-dev-site's wdio configuration will soon be removed and should not be used.

1. The wdio configuration has been updated to use [selenium 3.14.0-helium](https://github.com/SeleniumHQ/docker-selenium/tree/3.14.0-helium). It now also support hitting a selenium grid and provided `firefox` and `ie` capabilities. Chrome is still the only browser used by default.

Docker Images uses result in:
 - Selenium: 3.14.0
 - Google Chrome: 69.0.3497.100
 - ChromeDriver: 2.42
 - Mozilla Firefox: 62.0.3
 - GeckoDriver: 0.23.0

2. The default the wdio config will search for project-level webpack configuration and if it exists, it will be used.

3. A `terra.selector` was added to the default wdio configuration of `[data-terra-dev-site-content] *:first-child`.

4. There global refresh hook has been remove which previously reset the state of the page after each `it` was run.

This will improve test tests, enable one to write more cohesive test specs and catch bugs with functionally that may have previously been blow away. This also means Mocha `before` and `beforeEach` hooks should be used sparingly since these be executed multiple times, where as Mocha `it` blocks are easier to follow and get executed in the order they are written. With this, use `browser.refresh()` sparingly. Each refresh will end the current selenium session and require a new session request to be made in your spec.

5. New environmental variables:
- `process.env.BROWSERS`: Use to run tests against the various browsers. Headless Chrome and Headless Firefox browsers are available. IE is
 * an option when a SELENIUM_GRID_URL is provided.
- `process.env.SELENIUM_GRID_URL`: Use to set enable running test against a hosted selenium grid. Enables IE capabilities if the grid supports it.
- `process.env.SITE` - Use to disable running webpack in the ServeStatic Service, provide the packed site to serve directly.

### Visual Regression

The default form factor is now 'huge' to correct inconsistent viewport sizing that had occurred when a test used the default viewport for a test run vs defining a huge viewport. This may require screenshot updates, but no code changes are necessary.

### TerraService
Now provides the accessibility testing capabilities. These have been scoped to only check WCAG 2.0 AA and Section 508 accessibility standards to align with Terra's accessibility standards. 

The `Terra.should` test helpers have been removed. Use the `Terra.it` test helpers instead. These are Mocha-chia `it` blocks  to replace `Terra.should` test helpers:
  - `Terra.should.beAccessible()` -> `Terra.it.isAccessible()`
  - `Terra.should.matchScreenshot()` -> `Terra.it.matchesScreenshot()`
  - `Terra.should.validate()` -> `Terra.it.validatesElement()`

`Terra.it.isAccessible()` test options include:
  - rules - the axe rules to assert in the test run
  - viewports - this is not a recommended option. This can cause unintended behavior in UI and result in x page resizes for each Mocha `it` block rather than once before the test spec is ran.

This helper no longer accept context as a test option but instead always use `document`. Delete from passed test options. i.e. `Terra.should.beAccessible({ context })` -> `Terra.it.isAccessible()`.

`Terra.it.matchesScreenshot()` test options include:
  - mismatchTolerance - percentage of mismatch acceptable before failure
  - selector - the element to take a screenshot of
  - viewports - this is not a recommended option. This can cause unintended behavior in UI and result in x page resizes for each Mocha `it` block rather than once before the test spec is ran.

`Terra.it.validatesElement()` test options include:
  - axeRules - the axe rules to assert in the test run
  - mismatchTolerance - percentage of mismatch acceptable before failure
  - selector - the element to take a screenshot of

This helper no longer uses the selector value for scoping accessibility, but instead always use `document`.

Added `Terra.validates` test helpers. These are chia test helpers that can be used inside of `it` blocks. Terra.it test helpers use these directly, but providing these allow for one to write more cohesive test specs.
  - Terra.validates.accessibility()
  - Terra.validates.screenshot()
  - Terra.validates.element()

Added the `Terra.describeViewports` test helper. This is a Mocha `describe` block which is intended to use used as a top-level describe block for tests to simplify test writing and enabled writing test that support both viewport and formFactor testing for better local testing and paralyzed CI testing.

Using this will eliminate the need to use `--formFactors` when using the `tt-wdio` runner to run locale & form factor test locally--which improves test times.


### ServeStaticService

The serve static service can serve a static site or compile a site from the webpack config. The compiled site will be served by webpack-dev-server and the static site will be served by terra's serve static server.

The service will no longer inject the locale into served html files so when serving static sites, you will be responsible for adding the locale to the static files.

When compiling a sites with webpack, the ```defaultLocale```` environment variable will be passed to the webpack config for the current test locale. This will be done automatically for projects using terra-dev-site.

For projects extending terra-toolkit's default webpack configuration, be sure to make the following changes to enable locale testing:

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

// Import the terra-toolkit configuration.
const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');

// Create the app-level configuration
const appWebpackConfig = () => ({
  entry: {
    index: path.resolve(path.join(__dirname, 'lib', 'site', 'Index')),
  },
  plugins: [
      new HtmlWebpackPlugin({
+       lang: defaultLocale,
        template: path.join(__dirname, 'lib', 'index.html'),
      }),
    ],
});

// combine the configurations using webpack-merge
const mergedConfig = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), appWebpackConfig(env, argv))
);

module.exports = mergedConfig;
```

Template:

```html
<!doctype html>
<html lang="<%= htmlWebpackPlugin.options.lang %>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>index</title>
  </head>
  <body>
    <h1>index</h1>
  </body>
</html>
```

For compiled sites, the service will respect the devServer setting in webpack config with a few exceptions:

```javascript
module.exports = {
  devServer: {
    // Disable hot reloading and javascript injection to watch for changes.
    hot: false,
    inline: false,
    host: '0.0.0.0',
    publicPath: '/',
    port, // From wdio config.
    index, // From wdio config.
    stats: {
      colors: true,
      children: false,
    },
  },
};
```

### AxeService
The AxeService has been removed. The accessibility capabilities the Axe Service provided has been move to the Terra Service because the services could not run independently. The `axe` key can still be used for configuration and the test helper and axe chai assertion can be used. Please note, the `runOnly` option has been removed from Terra.should.beAccessible test helper and axe chai method and resetScroll has been enabled.

If you use the default wdio config, no changes need to be made. If using a custom wdio configuration, be sure to remove the AxeService from the wdio config:

```diff
const {
- Axe: AxeService,
  SeleniumDocker: SeleniumDockerService,
  ServeStaticService,
  Terra: TerraService,
} = require('terra-toolkit/lib/wdio/services/index');

const config = {
  ...
- services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService, AxeService],
+ services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService],

  axe: {
    inject: true,
  },
}
```

Documentation can now be found [here](https://github.com/cerner/terra-toolkit/blob/master/docs/Wdio_Utility.md).

## Nightwatch

The nightwatch utility and peer dependencies have been removed in this toolkit release. Be sure to remove the `nightwatch` dev-dependency in your project, if it exists.

## NEXT: Upgrade to Toolkit v5
See Part 2 for more information on the step-by-step dependency and script changes for terra-toolkit v5.
