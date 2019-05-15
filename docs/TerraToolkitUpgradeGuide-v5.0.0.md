# Terra Toolkit Upgrade Guide v5.0.0
This document will provide information on upgrading from terra-toolkit 4.x to 5.0.0.

## Webpack Configuration
### Configuration Changes
1. The browsers list provided to the Autoprefixer plugin no longer directly uses the `browserslist-config-terra`'s list of targeted browsers. Autoprefixer recommends including this list via a browserslist key to your package.json to configural all build tools with the same browsers list. Fixed [#110](https://github.com/cerner/terra-toolkit/issues/110).

    Add the `browserslist-config-terra` targeted browsers (or a custom list) to your package.json like:
```
{
  "browserslist": [
    "extends browserslist-config-terra"
  ]
}
```

2. For prod compilation, css will be minimized via `cssnano`.

### Dependencies Changes
The following webpack dependency changes were made in Terra toolkit's default webpack configuration. Please note, upgrading to use babel `^7` is required to use these dependency updates.

**Dependency to Peer Dependencies**
Terra recommeneds using the bins provided by these webpack dependencies. To enuse you always have access to these bins and the correct versions, these are now defined as peer dependencies: 
- webpack
- webpack-cli
- webpack-dev-server

**Updated**
- autoprefixer: `^8.5.2` -> `^9.5.1`
- babel-loader: `^7.1.2` -> `^8.0.5` [* requires babel `^7`]
- clean-webpack-plugin: `^0.1.17` -> `^2.0.1`
- css-loader: `^0.28.7` -> `^2.1.1`
- file-loader: `^1.1.5` -> `^3.0.1`
- mini-css-extract-plugin: `^0.4.5` -> `^0.6.0`
- postcss: `^6.0.9` -> `^7.0.16`
- postcss-assets-webpack-plugin: `^2.0.0` -> `^3.0.0`
- postcss-custom-properties: `^7.0.0` -> `^8.0.10`
- postcss-loader: `^2.0.6` -> `^3.0.0`
- raw-loader: `^0.5.1` -> `^2.0.0`

**Added**
- cssnano: `^4.1.10`
- cssnano-preset-advanced: `^4.0.7`

**Removed**
- `browserslist-config-terra`