# Terra Toolkit Wdio Helpers

## Wdio Runner
Terra Toolkit offers its own wdio test runner which runs wdio test runs for specified locales, themes, and form factors. This allows for locale and/or theme test runs that can match parallelized container test runs by synchronously running the wdio for each test run variation. This runner is a replacement for webdriverio's bin script `wdio` by directly calling webdriverio's test launcher module for each test variation.

Terra's wdio test runner is available via the `tt-wdio` cli or the `wdio-runner` javascript function.

Before running this script, it is recommended you pack the static site in production mode and add the relative path to the `site` key in the wdio configuration. This would only be desired for locally testing with this script.

#### API
Run ```tt-wdio --help``` to see the configuration options.

If no config is supplied to `tt-wdio`, `tt-wdio` will first search for `wdio.conf.js` in the working directory. If that is not found, it will attempt to use the default wdio config supplied by terra-dev-site.

#### CLI Usage
In your package.json
```JSON
{
  "pack": "NODE_ENV=production webpack --config ./webpack.config.js -p",
  "test:wdio-locally": "npm run pack; tt-wdio --config ./wdio.conf.js --locales ['en','es'] --themes ['orion-fusion-theme','cerner-clinical-theme']; rm -rf ./build"
}
```

#### Function Usage
In your code
```
const runner = require('terra-toolkit/scripts/wdio/wdio-runner');

runner({
  configPath: './wdio.conf.js',
  continueOnFail: true,
  locales: ['en', 'es'],
  browsers: ['chrome', 'firefox'],
  themes: ['orion-fusion-theme', 'cerner-clinical-theme'],
});
```

## Wdio Screenshot Cleanup
Terra Toolkit offers a screenshot cleanup tool to remove `errorScreenshots`, `latest`, `diff` and, if indicated, `reference` screenshots. This is available via the `tt-clean-screenshots` cli or the `clean-screenshots` javascript function.

`tt-wdio` will call this before calling its test runner, such that the generated screenshot within your project are from the only the latest test run(s).

#### API
Run ```tt-clean-screenshots --help``` to see the configuration options.

If no config is supplied to `tt-clean-screenshots`, `tt-clean-screenshots` will first search for `wdio.conf.js` in the working directory. If that is not found, it will attempt to use the default wdio config supplied by terra-dev-site.

#### CLI Usage
```JSON
{
  "clean-screenshots": "tt-clean-screenshots"
}
```

#### Function Usage
```
const cleanScreenshots = require('terra-toolkit/scripts/wdio/clean-screenshots');

cleanScreenshots();
```
