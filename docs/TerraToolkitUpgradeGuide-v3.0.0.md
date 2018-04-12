# Terra Toolkit Upgrade Guide v3.0.0
This document will provide information on upgrading from Terra Toolkit 2.x to 3.0.0.

If you use terra-dev-site please refer to it's upgrade guide as it abstracts away fom additional config that is required here.

## Webpack 4
Terra toolkit and it's dependencies have been upgraded to consume webpack 4. Terra toolkit is now intended to provide Webpack to the librarys that consume it. 
Users of Terra toolkit should not add a direct dependency to webpack in their package JSON after updating. We have made this change to provide a single point of upgrading webpack.

Terra toolkit now provides a default webpack config and prod webpack config. These configs will need to be referenced by the app level webpack config to add in an entry (unless consuming terra-dev-site). We recommed using [webpack-merge](https://github.com/survivejs/webpack-merge).

Translation Aggregation has been added

The `webpack` command

## I18N aggregation

## Serve

## WebdriverIO

### ExpressDevServerService

### WebpackDevServerService

