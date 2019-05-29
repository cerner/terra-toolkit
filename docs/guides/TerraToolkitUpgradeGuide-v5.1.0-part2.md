# Terra Toolkit Upgrade Guide v5.0.0 - Part 2

This document will provide the step-by-step changes required to upgrade from terra-toolkit 4.x to 5.0.0. 

**NOTE: The information in Part 1 is very important to understand to make the Part 2 changes smoothly. Be sure to read both parts.**


## Step 1. Update Terra-Toolkit
Update the toolkit version:

```bash
>  npm update terra-toolkit
```

<details>
<summary>
You will likely see unmet peer-dependency logs for babel and webpack.
</summary>

```bash
npm WARN terra-toolkit@5.0.0 requires a peer of @babel/cli@^7.4.4 but none was installed.
npm WARN terra-toolkit@5.0.0 requires a peer of webpack-cli@^3.3.2 but none was installed.
npm WARN terra-toolkit@5.0.0 requires a peer of webpack-dev-server@^3.3.1 but none was installed.
npm WARN terra-toolkit@5.0.0 requires a peer of webpack@^4.30.0 but none was installed.
npm WARN babel-loader@8.0.6 requires a peer of webpack@>=2 but none was installed.
npm WARN babel-loader@7.1.5 requires a peer of webpack@2 || 3 || 4 but none was installed.
npm WARN html-webpack-plugin@3.2.0 requires a peer of webpack@^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0 but none was installed.
npm WARN clean-webpack-plugin@2.0.2 requires a peer of webpack@* but none was installed.
npm WARN css-loader@2.1.1 requires a peer of webpack@^4.0.0 but none was installed.
npm WARN file-loader@3.0.1 requires a peer of webpack@^4.0.0 but none was installed.
npm WARN mini-css-extract-plugin@0.6.0 requires a peer of webpack@^4.4.0 but none was installed.
npm WARN postcss-assets-webpack-plugin@3.0.0 requires a peer of webpack@^4.10.2 but none was installed.
npm WARN raw-loader@2.0.0 requires a peer of webpack@^4.3.0 but none was installed.
npm WARN sass-loader@7.1.0 requires a peer of webpack@^3.0.0 || ^4.0.0 but none was installed.
npm WARN terser-webpack-plugin@1.3.0 requires a peer of webpack@^4.0.0 but none was installed.
```
</details>


Peer dependencies are dependencies required by a module to run correctly but must be explicitly installed by the consuming project. 

We will resolve these iteratively as we upgrade.

## Step 2. Add Webpack Peer Dependencies
Toolkit has define a few webpack dependencies as peer dependencies to ensure you always have access to these webpack bins and that you are using the correct versions. 

```bash
> npm install  --save-dev webpack webpack-cli webpack-dev-server
```

This should resolve unmet  `webpack`, `webpack-cli`, and `webpack-dev-server` peer dependency errors we saw when updating the terra-toolkit version.

## Step 3. Add Babel Peer Dependencies

To use toolkit v5, you **must** upgrade to use `babel v7`. This change _will_ impact the major version of most of the build tools your project will use. We have included steps for what we feel are common changes most project will need, but please reference [Babel's v7 Upgrade Guide](https://babeljs.io/docs/en/v7-migration-api) more info. 

### 1. Uninstall the babel v6 dev dependencies
Babel now uses [scoped npm packages](https://docs.npmjs.com/misc/scope), so we cannot directly upgrade with `npm upgrade`, instead we must uninstall the existing babel packages and then install the scoped package equivalent.

```bash
> npm uninstall babel-cli babel-core babel-plugin-transform-object-assign babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react
```

### 2. Install the babel v7 dev dependencies

```bash
> npm install  --save-dev @babel/cli @babel/core @babel/plugin-transform-object-assign @babel/plugin-proposal-object-rest-spread @babel/preset-env @babel/preset-react
```
This should have resolved the remaining unmet peer dependency errors we saw when updating the terra-toolkit version.

### 3. Add a `babel.config.js` File
Babel changed how the babel configuration is used and should be written. Babel recommends using a `babel.config.js` for better compatibility with monorepos, webpack tools, etc. 

```js
module.exports = (api) => {
  api.cache(true);
  api.assertVersion('^7.4.4');

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
  ];
  const plugins = [
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-object-rest-spread',
  ];

  return {
    presets,
    plugins,
  };
};
```

Be sure to check your project's current `.babelrc` config to ensure these presets and plugins are correct.

### 4. Remove the `.babelrc` file
The `.babelrc` is no longer needed with the addition of the `babel.config.js` file.

### 5. Check Jest Versions
If your project uses `jest` and/or `babel-jest` for unit testing, these dev dependencies will also need updated:

```bash
> npm update jest babel-jest
```

## Step 3. Add Browserslist Configuration
To ensure all tools are properly configured (especially webpack since it generates your site assets!) you **must** provide a browserslist configuration in your project.

[Browserslist](https://github.com/browserslist/browserslist) is a tool used by most of the build tools in your project (babel, eslint, various webpack plugins) to ensure you are developing correctly for the list of target browsers you provide.

<details>
<summary>
Terra recommends using the list provided by browserslist-config-terra.
</summary>

See the [`browserslist-config-terra` documentation](https://github.com/cerner/browserslist-config-terra) for more info.

### 1. Add `browserslist-config-terra` dev dependency
```bash
> npm install --save-dev browserslist-config-terra
```
### 2. Add a `browserslist` key to the `package.json`

```json
"browserslist": [
  "extends browserslist-config-terra"
]
```
</details>

## Step 4. Check Aggregate Translations Usage
If your project runs aggregate-translations for jest unit testing, you will need to remove the terra-toolkit aggregate-translations reference, since it no longer exists.

### 1. Install terra-aggregate-translations
```
> npm install --save-dev terra-aggregate-translations
```
### 2. Update aggregate-translation imports
```diff
- const aggregateTranslations = require('terra-toolkit/scripts/aggregate-translations/aggregate-translations');
+ const aggregateTranslations = require('terra-aggregate-translations');
```

## Step 5. Update Start Scripts 

### Serve

Serve is now a thin abstraction on webpack dev server and the command line api is now identical. With this addition it now means that you have control over the dev server through options specified in your webpack config as well as through the cli.

Why use serve instead of webpack-dev-server directly? Having the serve abstraction provides a hook for us to change the servers implementation in case webpack-dev-server no longer meets our needs.

A webpack.config must be provided at the root level or passed in via `--config` flag in the package.json script. The webpack-dev-server cannot attempt to automatically load our defaults.

```diff
//package.json
scripts: {
-  "start": "tt-serve",
+  "start": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js",
+    "start-prod": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js --env.disableHotReloading -p",

-  "start-static": "tt-serve-static",
+  "start-static": "npm run compile:prod && tt-serve-static --site ./build",
}

```


### Serve Static

Webpack-dev-server now supports IE 10+, because of this change we have removed the ability for serve-static to run webpack to create your site. Serve static now will simply host static site content.

If an html page is not found serve static will try to return /404.html with a status of 404. If that file is not found, serve-static will return a 404 status as before.

These api options have been removed from both the cli and javascript:

- config
- production
- disk

If you want to serve a non hot-reloading site without pre-building your site, use tt-static with the `--env.disableHotReloading` flag passed via the cli.

```diff
//package.json
scripts: {
  "tt-serve": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js -p --env.disableHotReloading",
  "tt-serve-dev": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js",
}
```

### tt-heroku-serve-static

This script was removed. Use this instead:
```npm run compile:prod && tt-serve-static --port $PORT --site './build'```

## WebdriverIO



### Visual Regression

The default form factor is now 'huge' to correct inconsistent viewport sizing that had occurred when a test used the default viewport for a test run vs defining a huge viewport. This may require screenshot updates, but no code changes are necessary.

### TerraService
- The `viewportChangePause` option was removed the `Terra.should.matchScreenshot`.

### ServeStaticService

The serve static service can serve a static site or compile a site from the webpack config. The compiled site will be served by webpack-dev-server and the static site will be served by serve static.

The service will no longer inject the locale into served html files.

For static sites, the original files will be served, you will be responsible for adding the locale to the static files.

For compiled sites, the ```defaultLocale```` environment variable will be passed to the webpack config indicating what locale the site should be compiled for. This will be done automatically for projects using terra-dev-site.

For example:
Webpack config

```javascript
module.exports = (env = {}) => {
  const { defaultLocale = 'en' } = env;
  return {
    plugins: [
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: 'index.html'),
        filename: './index.html',
      }),
    ],
  };
};
```

Template

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

## Step 100. Remove Nightwatch Dependency

Remove the `nightwatch` dev-dependency in your project.
```
npm uninstall nightwatch
```
