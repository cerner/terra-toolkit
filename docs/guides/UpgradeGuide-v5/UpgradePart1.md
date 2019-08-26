# Terra Toolkit Upgrade Guide v5 - Part 1

This document will provide the step-by-step dependency and script changes required to successfully upgrade from terra-toolkit 4.x to 5.x.

Please note the steps outlined in this guide aim to hit the majority use-case! :) Your project may need additional dependency and/or configuration changes. From what we have evaluated, the dependency changes recommended in this guide should minimal. However, as always, it is best practice to verify yourself what the breaking changes and/or requirements are for bumping to a new major version of a dev-dependency.

## Step 0. Delete the package-lock.json
If your project has a `package-lock.json`, delete it, otherwise the steps provided will not work.

## Step 1. Update Terra-Toolkit
Update the toolkit version:

```bash
>  npm uninstall terra-toolkit && npm install --save-dev terra-toolkit@latest
```

<details>
<summary>
You will likely see unmet peer-dependency logs for babel and webpack (toggle for example output).
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
Toolkit has defined a few webpack dependencies as peer dependencies to ensure you always have access to these webpack bins and that you are using the correct versions. 

```bash
> npm install --save-dev webpack webpack-cli webpack-dev-server core-js raf regenerator-runtime
```

This should resolve unmet webpack peer dependency errors we saw when updating the terra-toolkit version.

If you provide any other webpack dev-dependencies in your package.json, either remove these or ensure they are using the correct versions. These include `sass-loader`, `babel-loader`, `node-sass`, `postcss`, etc. Here is the [list of webpack dependencies](https://github.com/cerner/terra-toolkit/blob/master/docs/Webpack.md#terras-configuration-requirements) that are installed with terra-toolkit.

## Step 3. Add Babel Peer Dependencies

To use toolkit v5, you **must** upgrade to use `babel v7`. This change _will_ impact the major version of most of the build tools your project will use. We have included steps for what we feel are common changes most project will need, but please reference [Babel's v7 Upgrade Guide](https://babeljs.io/docs/en/v7-migration-api) more info. 

### 1. Uninstall the babel v6 dev dependencies
Babel now uses [scoped npm packages](https://docs.npmjs.com/misc/scope), so we cannot directly upgrade with `npm upgrade`, instead we must uninstall the existing babel packages and then install the scoped package equivalent.

```bash
> npm uninstall babel-cli babel-core babel-plugin-transform-object-assign babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react
```

### 2. Install the babel v7 dev dependencies

```bash
> npm install --save-dev @babel/cli @babel/core @babel/plugin-transform-object-assign @babel/plugin-proposal-object-rest-spread @babel/preset-env @babel/preset-react
```
This should have resolved the remaining unmet peer dependency errors we saw when updating the terra-toolkit version.

### 3. Add a `babel.config.js` file
Babel changed their recommendation on how to write and use the babel configuration. Babel recommends using a `babel.config.js` for better compatibility with monorepos, webpack tools, etc. so we've opted to require this configuration for compatibility with our webpack configuration.

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

Check this against project's current `.babelrc` config to ensure all of the presets and plugins have been included.

### 4. Remove the `.babelrc` file
The `.babelrc` is no longer needed with the addition of the `babel.config.js` file.

### 5. Check Jest Versions
If your project uses `jest` and/or `babel-jest` for unit testing, these dev dependencies will also need updated:

```bash
> npm uninstall jest babel-jest && npm install --save-dev jest babel-jest
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

## Step 5. Update the Project Scripts 

The start scripts in the `package.json` need to be updated. `tt-serve` is now a thin abstraction on [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/) and `tt-start-static` will only serve compiled site assets.

### 1. Update the `start` script
The `webpack-dev-server` cannot automatically load our default configuration files that exists in the node_modules directory. Thus, a webpack.config must be provided at the root level or the configuration needs to be passed via the `--config` flag in the package.json script. 

```diff
-  "start": "tt-serve",
+  "start": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js",
```

### 2. Add a `start-prod` script
Add the following script to run `webpack-dev-server` with hot-reloading disabled to view the assets that are used during the test run.

```diff
+    "start-prod": "tt-serve --config node_modules/terra-dev-site/config/webpack/webpack.config.js --env.disableHotReloading -p",
```

When running wdio integration tests, the ServeStatic Service will compile your assets in production mode and serve the assets with hot-reloading disabled when the site assets have not been pre-compiled. This script will generate these same assets.

### 3. Update the `start-static` script
Since `tt-start-static` will only serve compiled site assets, be sure to compile the assets before starting the server.

```diff
-  "start-static": "tt-serve-static",
+  "start-static": "npm run pack && tt-serve-static",
```
If your project does not have a `pack` script, add the following:
```diff
+  "pack": "NODE_ENV=production webpack --config node_modules/terra-dev-site/config/webpack/webpack.config.js -p",
```

### 4. Update the `test:wdio:local` script
Since `ot-wdio` has been removed, update to use `tt-wdio` and provide the wdio configuration path and selenium grid url.

```diff
-  "test:wdio:local": "ot-wdio --browsers=['firefox','ie']",
+  "test:wdio:local": "tt-wdio --config node_modules/terra-toolkit/config/wdio/wdio.conf.js --gridUrl='my.grid.com' --browsers=['firefox','ie']",
```

## Step 6. Remove Nightwatch

Remove the `nightwatch` dev-dependency in your project. 
```
npm uninstall nightwatch
```
If you still have nightwatch tests, these will need to be migrated to Webdriver tests. See the [Nightwatch to Webdriver.io Migration Guide](https://github.com/cerner/terra-toolkit/wiki/Webdriver.io-Migration-Guide#nightwatch-to-webdriverio-migration-guide) for more info.

## Step 7. Validate Dependency and Script Changes
### 1. Run `clean:install`
Run a clean install to confirm all old dependencies were correctly removed, new dependencies were added and all peer-dependencies were correctly met.
```bash
> npm run clean:install
```

### 2. Run `compile`
Most projects run babel in a `postinstall` step, but it would still be good to validate that the compile script runs correctly.
```bash
> npm run compile
```

### 3. Run `jest`
Verify jest runs correctly and all tests pass.
```bash
> npm run jest
```

### 4. Run `start`
Verify your site renders correctly and all pages are displaying as expected.
```bash
> npm run start
```

### 5. Run `start-prod`
Verify hot-reloading is correctly disabled so you can quickly check the assets used during test runs.
```bash
> npm run start-prod
```

### 6. Run `start-static`
Verify your site is packed and served as static content.
```bash
> npm run start-static
```

## NEXT: Webdriver Test Updates
See [Part 2 for more information on Webdriver changes](https://github.com/cerner/terra-toolkit/blob/master/docs/guides/UpgradeGuide-v5/UpgradePart2.md).




