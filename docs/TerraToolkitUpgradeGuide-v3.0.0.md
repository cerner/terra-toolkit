# Terra Toolkit Upgrade Guide v3.0.0
This document will provide information on upgrading from Terra Toolkit 2.x to 3.0.0.

If you use terra-dev-site please refer to it's upgrade guide as it abstracts away fom additional config that is required here.

## Webpack 4
Terra toolkit and it's dependencies have been upgraded to consume webpack 4. Terra toolkit is now intended to provide Webpack to the librarys that consume it. 
Users of Terra toolkit should not add a direct dependency to webpack in their package JSON after updating. We have made this change to provide a single point of upgrading webpack.

Terra toolkit now provides a default webpack config. This configs will need to be referenced by the app level webpack config to add in an entry (unless consuming terra-dev-site). We recommed using [webpack-merge](https://github.com/survivejs/webpack-merge) to combine configs.
The default webpack config is now a function that will flex between production and development modes by passing in the -p flag when compiling with webpack. For more about webpack config as a function go [here](https://webpack.js.org/configuration/configuration-types/).

Translation Aggregation has been added to the default webpack config. By default all of the terra supported locales are include. If you need to customize this list, see the I18N aggregation section below. To completely disable translation aggregation within the webpack build to add your own, you can pass the environment variable `--env.disableAggregateTranslations` to the webpack command.

```bash
webpack --config src/webpack/webpack.config --env.disableAggregateTranslations
```

The `webpack` command is available to applications consumeing terra-toolkit.

The major change with webpack4 plugins is that the mini-css-extract-plugin now replaces extract-text-webpack-plugin which is no longer maintained.

## I18N aggregation
In a previous release, the aggregation translations script (`tt:aggregate-translations`) was added to terra-toolkit. In this release a new configuration option has been added.

## Serve

## WebdriverIO
More defaults have been added to the

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

