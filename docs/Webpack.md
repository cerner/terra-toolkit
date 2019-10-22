# Webpack
[Webpack](https://webpack.js.org/) is a module bundler used to compile modules with dependencies and generate static assets. Webpack is a very powerful tool that is highly configurable and Terra components rely on specific polyfills, webpack loaders and plugins to render correctly.

## Terra's Configuration Requirements
Below is the list of polyfills, webpack loaders and plugins Terra components rely on:

### Polyfills
React 16 depends on the collection types ``Map`` and ``Set`` and it depends on ``requestAnimationFrame``, so Terra UI needs a polyfilled environment.
- [core-js](https://github.com/zloirock/core-js) - Provides polyfills necessary for ECMAScript: promises, symbols, collections, iterators, typed arrays, many other features, ECMAScript proposals, some cross-platform WHATWG / W3C features and proposals like URL.\*
- [regenerator-runtime](https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime) - Transformer for enabling ECMAScript 6.\*
- [raf](https://github.com/chrisdickinson/raf) - Provides requestAnimationFrame polyfill library.

### JavaScript Loaders
- [babel-loader](https://webpack.js.org/loaders/babel-loader/) - Allows transpiling JavaScript files using [Babel](https://github.com/babel/babel) and webpack.
- [file-loader](https://webpack.js.org/loaders/file-loader/) - Instructs webpack to emit the required object as file and to return its public URL.

### JavaScript Plugins
- [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) - Plugin to define global compile-time values, including:
  - `CERNER_BUILD_TIMESTAMP` - The time that webpack was executed in ISO8601 format.

### CSS Loaders and Plugins
- [autoprefixer](https://github.com/postcss/autoprefixer) - Plugin to parse CSS and add vendor prefixes to CSS rules. This should be configured with [`browserslist-config-terra`](https://github.com/cerner/browserslist-config-terra). \*
- [css-loader](https://webpack.js.org/loaders/css-loader/) - The css-loader interprets ``@import`` and ``url()`` like ``import/require()`` and will resolve them. The css-loader is also used to parse CSS Modules.
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) - This plugin extracts CSS into separate files and supports on-demand-loading of CSS and SourceMaps.
- [postcss-loader](https://webpack.js.org/loaders/postcss-loader/) - Transforms styles with JS plugins.
- [postcss-assets-webpack-plugin](https://github.com/klimashkin/postcss-assets-webpack-plugin#apply-postcss-plugins-to-webpack-css-asset) - Gets the css, extracted by ExtractTextPlugin and apply postcss plugins to it.
- [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties) - Transforms W3C CSS Custom Properties to static values.\*
- [postcss-rtl](https://github.com/vkalinichev/postcss-rtl) - PostCSS-plugin for RTL-adaptivity.
- [sass-loader](https://webpack.js.org/loaders/sass-loader/) - Loads a SASS/SCSS file and compiles it to CSS.
- [style-loader](https://webpack.js.org/loaders/style-loader/) - Adds CSS to the DOM by injecting a ``<style>`` tag.

### Production Only Plugins
- [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin) -
A webpack plugin to remove/clean your build folder(s) before building.
- [terser-webpack-plugin](https://webpack.js.org/plugins/terser-webpack-plugin/) - minifies your JavaScript.

_\* Required to support IE legacy browsers_

## Configuring Webpack
Terra has two webpack configuration recommendations to ensure webpack configurations are defined consistently:

1) Terra-toolkit's [default webpack configuration](https://github.com/cerner/terra-toolkit/blob/master/config/webpack/webpack.config.js).
    - Use when building a standalone site.
    - Additional configuration required.

2) Terra-dev-site's [webpack configuration](https://github.com/cerner/terra-toolkit/blob/master/config/webpack/webpack.config.js)
    - Use when building a documentation and test site with the terra-dev-site module.
    - This extends terra-toolkit's webpack configuration and requires no additional configuration

By using this default configuration, we will manage webpack dependencies and set up translation aggregation. If you choose not to use the default configuration, Toolkit's configuration can  be extend to meet your needs or it can be used as an guide to build your own.

### Extending the Default Config
1. Create a `webpack.config.js` file.
2. Import terra-toolkit's webpack configuration.
3. Create an app-level webpack configuration which, at a minimum, supplies an entry and an [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) entry (version ^3.2.0 or higher).
4. Use [`webpack-merge`](https://github.com/survivejs/webpack-merge) to combine the app config with terra-toolkit's default config. Note: since the default config is an function, it will need to be executed first.

Here is an example app-level webpack configuration:
```javascript
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
        title: 'My App',
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

#### Translation Aggregation
Terra's supported locales will be aggregated when using the default webpack configuration through the `aggregate-translations` pre-build tool. To customize which translations are aggregated, refer these docs on [aggregating translations](https://github.com/cerner/terra-aggregate-translations#terrai18nconfig-example). Alternatively, if translations are not required, disable translation aggregation within the webpack build by passing the environment variable `--env.disableAggregateTranslations` to the webpack command.

```bash
webpack --env.disableAggregateTranslations
```

#### Hot Reloading with Webpack Dev Server
Terra's webpack configuration enables hot reloading by default in development mode. Disable this behavior by passing `--env.disableHotReloading` to the cli when running tt-serve. This is useful to generate the production assets used during testing.

```bash
tt-serve --env.disableHotReloading
```

#### Development vs Production
The default webpack configuration is a function that will flex between production and development modes when passing the `-p` flag while compiling with webpack. See webpack's documentation on [configuration types](https://webpack.js.org/configuration/configuration-types/) for more information.

#### Duplicate Asset Management

The `@cerner/duplicate-package-checker-webpack-plugin` is used to detect duplicated packages within a generated Webpack bundle. If more than one version of the same package are present in a bundle, the package information will be logged with a Webpack compilation warning.

Some packages can be duplicated safely, so these warnings may not indicate a serious problem. However, some packages are intended to be used as singleton packages. If these singleton packages are duplicated, errors will be logged and the Webpack compilation will fail.

|Package Name|Description|
|---|---|
|`react`|Has undefined behavior when multiple versions are loaded at the same time.|
|`react-dom`|Has undefined behavior when multiple versions are loaded at the same time.|
|`react-intl`|Uses React Context for communication of intl APIs.|
|`react-on-rails`|Uses a singleton registry to manage available components.|
|`terra-breakpoints`|Uses React Context for communication of active breakpoint APIs.|
|`terra-application`|Uses a number of Context-providing components.|
|`terra-disclosure-manager`|Uses React Context for communication of progressive disclosure APIs.|
|`terra-navigation-prompt`|Uses React Context for communication of navigation prompt APIs.|

If duplicates of the above packages are detected, options for remediation include:

- Updating the dependencies that are causing the duplication. Generally, the above packages should be listed as peerDependencies to prevent duplication.
- Adding a webpack `resolve.alias` to the configuration that will force Webpack to use a single version of the duplicated package. However, this may cause logic to fail if the APIs between the expected versions differ.
