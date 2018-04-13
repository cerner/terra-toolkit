# Terra Toolkit Upgrade Guide v3.0.0
This document will provide information on upgrading from Terra Toolkit 2.x to 3.0.0.

If you use terra-dev-site please refer to it's upgrade guide as it abstracts away from additional config that is required here.

## Webpack 4
Terra toolkit and it's dependencies have been upgraded to consume webpack 4. Terra toolkit is now intended to provide Webpack to the libraries that consume it.
Users of Terra toolkit should not add a direct dependency to webpack in their package JSON after updating. We have made this change to provide a single point of upgrading webpack.

Terra toolkit now provides a default webpack config. This config will need to be referenced by the app level webpack config to add in an entry (unless consuming terra-dev-site). We recommend using [webpack-merge](https://github.com/survivejs/webpack-merge) to combine configs.
The default webpack config is now a function that will flex between production and development modes by passing in the -p flag when compiling with webpack. For more about webpack config as a function go [here](https://webpack.js.org/configuration/configuration-types/).
If you are consuming this webpack config to create another webpack config, don't forget that you need to execute the function first.

Translation Aggregation has been added to the default webpack config. By default all of the terra supported locales are included. If you need to customize this list, see the I18N aggregation section below. To completely disable translation aggregation within the webpack build to add your own, you can pass the environment variable `--env.disableAggregateTranslations` to the webpack command.

```bash
webpack --config src/webpack/webpack.config --env.disableAggregateTranslations
```

The `webpack` command is available to applications consuming terra-toolkit.

The major change with webpack4 plugins is that the mini-css-extract-plugin now replaces extract-text-webpack-plugin which is no longer maintained.

## I18N aggregation
In a previous release, the aggregation translations script (`tt:aggregate-translations`) was added to terra-toolkit. In this release a new configuration option has been added. You can specify the aggregate-translations configuration through a `terraI18n.config.js` file in your root project directory.

### Example
```javascript
const fse = require('fs-extra');
const i18nConfig = {
  baseDir: process.cwd(),
  directories: [./translations],
  fileSystem: fse,
  locales: ['ar', 'en', 'en-US', 'en-GB', 'es', 'es-US', 'es-ES', 'de', 'fi-FI', 'fr', 'fr-FR', 'pt', 'pt-BR'],
};

exports.config = i18nConfig;
```

## Serve
Terra-toolkit now provides a couple of scripts to help serve your site for development, testing, or as a doc site.

### serve
Serve is a replacement for webpack-dev-server. Behind the scenes it's using [webpack-serve](https://github.com/webpack-contrib/webpack-serve).
Serve is a hot reloading server and does not work on IE 10 or below. See [compatible browsers](https://caniuse.com/#feat=websockets). Use serve-static for IE 10 testing.

### serve-static
Serve static is a non-hot reloading server that uses express behind the scenes. The serve static method can either take a pre-compiled site folder or a webpack config to compile a site for you. It also offers a virtual file system to avoid saving files to disk. This server is also used in `TerraToolkitServeStaticService` to serve sites for wdio visual regression testing.

For more information go [here](https:/github.com/cerner/terra-toolkit/master/scripts/serve/readme.md).

## WebdriverIO
More defaults have been added to the default wdio config. The only config that is now required to be provided is your webpack config. (If you are using terra-dev-site, use the provided wdio config from that package which will have the webpack config already provided).

### Required config
```javascript
const wdioConf = require('terra-toolkit/lib/wdio/conf');
const webpackConfig = require('./webpack.config');

const config = {
  ...wdioConf.config,

  webpackConfig,
};

exports.config = config;
```

### New Defaults
* Port is defaulted to 8080
* TerraToolkitServeStatic is included by default to host your test site.
* The default specs search path now supports mono-repos out of the box.
** `./packages/*/tests/wdio/**/*-spec.js`
** `./tests/wdio/**/*-spec.js`
* base url is defaulted to `http://<localIP>:8080`
* depreciationWarnings are defaulted off
* axe is setup by default
* mouse reset default hook has been removed.

Default axe config
```javascript
const config = {
  axe:{
      inject: true,
      options: {
        rules: [{
          id: 'landmark-one-main',
          enabled: false,
        }],
      },
    }
  };
 ```

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

