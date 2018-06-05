# FAQ
## I'm trying to run tt-server or tt-serve-static and I get this Error `Error: Cannot find module 'webpack'`
What's happening here is that you have a dependency that is pulling in a conflicting version of webpack and the webpack module is not being included in the root level of node modules.
There are two fixes for this problem:
1. You can find the conflicting module and remove or update it. A good way to trouble shoot this is to generate a package-lock.json and search for the "webpack" module.
2. You can include the version of webpack that you need directly in your package.json. We prefer the first solution to allow us to upgrade webpack more easily in the future, but both will fix the issue.

## I am using toolkit v3, using the default webpack configuration and want to use the `html-webpack-plugin`, but I am receiving this error:

```bash
.../node_modules/html-webpack-plugin/lib/compiler.js:81
        var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
                                                  ^

TypeError: compilation.mainTemplate.applyPluginsWaterfall is not a function
```

- Fix this by bumping the `html-webpack-plugin` version to be `^3.2.0`

##  I am using toolkit v3/webpack v4 and want to use the extract-text-plugin, but am getting the error:

```bash
Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
```

- Fix this by using `mini-css-extract-plugin` v0.4.0 instead - at this time, `extract-text-plugin` does not support webpack 4.

## I am using toolkit v3, the default webpack configuration, and the default wdio configuration. When I run WebdriverIO tests, I receive this error:
```
Cannot read property 'viewport' of undefined
```
* `wdio-visual-regression-service` version `0.8.0` has an issue with the `browser.checkElement` function - make sure `wdio-visual-regression-service` within your package.json is pulling in **0.9.0** or above (Unfortunately, `wdio-visual-regression-service` has yet to rollout a `1.0.0` release, so `^0.8.0` will not automatically pull in `0.9.0`).
```
wdio-visual-regression-service": "^0.9.0",
```
