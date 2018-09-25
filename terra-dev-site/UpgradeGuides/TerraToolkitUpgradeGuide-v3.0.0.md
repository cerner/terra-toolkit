# Terra Toolkit Upgrade Guide v3.0.0
This document will provide information on upgrading from terra-toolkit 2.x to 3.0.0.

If you use terra-dev-site, please also refer to the [Terra Dev Site Upgrade Guide](https://github.com/cerner/terra-dev-site/blob/master/docs/TerraDevSiteUpgradeGuide-v0.5.0.md), as it abstracts away additional configuration that is required here.


## Webpack 4
Terra-toolkit's dependencies have been upgraded to consume webpack 4 and it provides the appropriate Webpack dpendencies to the libraries that consume it. Do not add a direct dependency to `webpack`, `webpack-cli`, `webpack-merge`, or `webpack-serve` in the package JSON after updating. We have made this change to provide a single point for rolling out webpack upgrades.

### Webpack Configuration
Terra toolkit now provides a default webpack configuration. The default webpack config is a function that will flex between production and development modes by passing in the -p flag when compiling with webpack. See webpack's documentation on [configuration types](https://webpack.js.org/configuration/configuration-types/) for more information.

Use terra-toolkit's configuration in the app level webpack config, where the app level config adds an `entry` and an [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin)- note if consuming terra-dev-site, this has been done for you! We recommend using [`webpack-merge`](https://github.com/survivejs/webpack-merge) to combine the app config with terra-toolkit's default config. Don't forget that the default config is an function that will needed to be executed first.

```javascript
const path = require('path');
const merge = require('webpack-merge');
const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');

const appWebpackConfig = () => ({
  entry: {
    index: path.resolve(path.join(__dirname, 'lib', 'site', 'Index')),
  },
  plugins: [
      new HtmlWebpackPlugin({
        title: 'My App',
        template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
      }),
    ],
});

const mergedConfig = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), appWebpackConfig(env, argv))
);

module.exports = mergedConfig;
```

#### Webpack Configuration Dependencies

We added the default webpack config to provide a base webpack configuration for you to build on and allow us to easily manage dependency updates. Below is a list of the webpack config dependencies toolkit provides automatically. Do not add these to your package.json dependencies.
- autoprefixer
- babel-loader
- babel-polyfill
- clean-webpack-plugin
- css-loader
- file-loader
- load-json-file
- mini-css-extract-plugin
- node-sass
- postcss
- postcss-assets-webpack-plugin
- postcss-custom-properties
- postcss-loader
- postcss-rtl
- raf
- raw-loader
- sass-loader
- uglifyjs-webpack-plugin

The major changes with webpack v4 plugins are that the `mini-css-extract-plugin` now replaces the  `extract-text-webpack-plugin` since it is no longer maintained and the `json-loader` was removed. Additionally, if you desire to use the `HtmlWebpackPlugin` in the app level config, be sure to specify the version to be `^3.2.0` or compile error will occur.

### Adding Translations
Translation Aggregation has been added to the default webpack config. By default, all of the terra supported locales are included. If you need to customize this list, see the I18N aggregation section below. To completely disable translation aggregation within the webpack build, you can pass the environment variable `--env.disableAggregateTranslations` to the webpack command.

```bash
webpack --config config/webpack/webpack.config --env.disableAggregateTranslations
```

###### The `webpack` command is available to applications consuming terra-toolkit.

## I18N aggregation
In a previous release, the aggregation translations script (`tt:aggregate-translations`) was added to terra-toolkit. In this release a new configuration option has been added. You can specify the aggregate-translations configuration through a `terraI18n.config.js` file in your root project directory.

### Example
```javascript
// terraI18n.config.js
const fse = require('fs-extra');
const i18nConfig = {
  baseDir: process.cwd(),
  directories: ['./translations'],
  fileSystem: fse,
  locales: ['ar', 'en', 'en-US', 'en-GB', 'es', 'es-US', 'es-ES', 'de', 'fi-FI', 'fr', 'fr-FR', 'nl', 'nl-BE', 'pt', 'pt-BR'],
};

module.exports = i18nConfig;
```

## Serve
Terra-toolkit now provides two ways serve your site for development, testing, or as a doc site.

### serve options
Serve is a replacement for webpack-dev-server. Behind the scenes it's using [webpack-serve](https://github.com/webpack-contrib/webpack-serve).
Serve is a hot reloading server and does not work on IE 10 or below. See [compatible browsers](https://caniuse.com/#feat=websockets). Use serve-static for IE 10 testing.

Update the start script in your package json to use the serve script:
```diff
-    "start": "webpack-dev-server --progress",
+    "start": "tt:serve",
```

### serve-static options
Serve static is a non-hot reloading server that uses express behind the scenes. The serve static method can either take a pre-compiled site folder or a webpack config to compile a site for you. It also offers a virtual file system to avoid saving files to disk. This server is also used by the new `ServeStaticService` to serve sites for wdio visual regression testing.

###### Go here more information about serve and serve-static and to see examples please go [here](https://github.com/cerner/terra-toolkit/tree/master/scripts/serve).

## WebdriverIO
More defaults have been added to the default wdio config. The only config that is now required to be provided is your webpack config and a global selector for taking screenshots. (If you are using terra-dev-site, use it's [provided wdio config](https://github.com/cerner/terra-dev-site/blob/master/config/wdio/wdio.conf.js) as these are both provided).

**NOTE:** The conf file has moved from `terra-toolkit/lib/wdio/conf.js` to `terra-toolkit/config/wdio/wdio.conf.js`. This change was made to provide a consistent location for our reusable configuration files.

### Required Wdio Config
```javascript
const wdioConf = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('./webpack.config');

const config = {
  ...wdioConf.config,

  webpackConfig,

  terra: {
    selector: // Global selector required for terra.should.matchScreenshot()
  },
};

exports.config = config;
```

### New Wdio Config Defaults
* Port is defaulted to 8080. It is used as the base url and to serve your site.
* ServeStaticService is included by default to host your test site.
* The default specs search path now supports mono-repos out of the box.
    * `./packages/*/tests/wdio/**/*-spec.js`
    * `./tests/wdio/**/*-spec.js`
* base url is defaulted to `http://<localIP>:8080`.
    * `ip` should now be removed as a dependency.
* depreciationWarnings are defaulted off
* mouse reset default hook has been removed.

### ExpressDevServerService
`ExpresDevServerService` has been renamed to `TerraToolkitServeStaticService`. If you are using the service directly, and not through the new default wdio config, the wdio config you need to setup has also been renamed from `expressDevServer` to `serveStatic` with no other changes.

```javascript
wdioConfig = {
  serveStatic: {
    port: 8080,
  }
};
```

### WebpackDevServerService
The `WepackDevServerService` has been removed from terra-toolkit. Please use the `TerraToolkitServeStaticService` instead.
