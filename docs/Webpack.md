# Webpack
[Webpack](https://webpack.js.org/) is a module bundler used to compile modules with dependencies and generate static assets. Webpack is a very powerful tool that is highly configurable and Terra components rely on specific polyfills, webpack loaders and plugins to render correctly.

## Configuring Webpack
Terra provides a [default webpack configuration](https://github.com/cerner/terra-toolkit/blob/master/config/webpack/webpack.config.js) via the `terra-toolkit` module which we recommend you extend to meet your needs. By using this default configuration, we will manage webpack dependencies and set up translation aggregation. If you choose not to use the default configuration, it can be used as an guide to build your own.

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
Terra's supported locales will be aggregated when using the default webpack configuration through the `aggregate-translations` pre-build tool. To customize which translations are aggregated, refer these docs on [aggregating translations](https://github.com/cerner/terra-toolkit/blob/master/docs/AggregateTranslations.md#terrai18nconfig-example). Alternatively, if translations are not required, disable translation aggregation within the webpack build by passing the environment variable `--env.disableAggregateTranslations` to the webpack command.

```bash
webpack --env.disableAggregateTranslations
```

#### Development vs Production
The default webpack configuration is a function that will flex between production and development modes when passing the `-p` flag while compiling with webpack. See webpack's documentation on [configuration types](https://webpack.js.org/configuration/configuration-types/) for more information.

## Terra's Configuration Requirements
Below is the list of polyfills, webpack loaders and plugins Terra components rely on:

### Polyfills
React 16 depends on the collection types ``Map`` and ``Set`` and it depends on ``requestAnimationFrame``, so Terra UI needs a polyfilled environment.
- [babel-polyfill](https://github.com/babel/babel/tree/7.0/packages/babel-polyfill) - Provides polyfills necessary for a full ES2015+ environment.\*
- [raf](https://github.com/babel/babel/tree/7.0/packages/babel-polyfill) - Provides requestAnimationFrame polyfill library.

### JavaScript Loaders
- [babel-loader](https://webpack.js.org/loaders/babel-loader/) - Allows transpiling JavaScript files using [Babel](https://github.com/babel/babel) and webpack.
- [file-loader](https://webpack.js.org/loaders/file-loader/) - Instructs webpack to emit the required object as file and to return its public URL.

### CSS Loaders and Plugins
- [autoprefixer](https://github.com/postcss/autoprefixer) - Plugin to parse CSS and add vendor prefixes to CSS rules. This is configured for [Terra's supported browsers](https://github.com/cerner/terra-core/wiki/Component-Features#cross-browser-support). \*
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

###### \* Required to support IE legacy browsers
