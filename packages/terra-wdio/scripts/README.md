# Terra Toolkit Wdio Helpers

## Wdio Runner
Terra Toolkit offers its own wdio test runner which runs wdio test runs for specified locales and form factors. This allows for locale test runs that can match parallelized container test runs by synchronously running the wdio for each test run variation. This runner is a replacement for webdriver's bin script `wdio` by directly calling Webdriver's test launcher module for each test variation.

Terra's wdio test runner is available via the `tt-wdio` cli or the `wdio-runner` javascript function.

Before running this script, it is recommended you pack the static site in production mode and add the relative path to the `site` key in the wdio configuration. This would only be desired for locally testing with this script.

#### API
| Name  | Default Value | Description |
| ------------- | ------------- | ------------- |
| **--config**  | `undefined` | The wdio config path for the tests.  |
| **--formFactors**  | `undefined` | The list of viewport sizes to test. |
| **-locales** | `['en']` | The list of locales to test. |
| **--continueOnFail** | `undefined` | Whether or not to execute all test runs when a run fails. |
| **--updateReference** | `undefined` | Whether or not to remove reference screenshots during screenshot cleanup. CLI use only. |
| **--port**  | `undefined` | [wdio option] The selenium server port. |
| **--host** | `undefined` | [wdio option] The selenium server host address. |
| **--baseUrl** | `undefined` | [wdio option] The base URL. |
| **--suite** | `undefined  ` | [wdio option] The suite to run. |
| **--spec** | `undefined` | [wdio option] The spec file to run. |

If no config is supplied to `tt-wdio`, `tt-wdio` will first search for `wdio.conf.js` in the working directory. If that is not found, it will attempt to use the default wdio config supplied by terra-dev-site.

#### CLI Usage
In your package.json
```JSON
{
  "pack": "NODE_ENV=production webpack --config ./webpack.config.js -p",
  "test:wdio-locally": "npm run pack; tt-wdio --config ./wdio.conf.js --locales ['en','es']; rm -rf ./build"
}
```

#### Function Usage
In your code
```
const runner = require('terra-toolkit/scripts/wdio/wdio-runner');

runner({
  configPath: './wdio.conf.js',
  continueOnFail: true,
  formFactors: ['tiny', 'medium'],
  locales: ['en', 'es']
});
```

## Wdio Screenshot Cleanup
Terra Toolkit offers a screenshot cleanup tool to remove `errorScrenshots`, `latest`, `diff` and, if indicated, `reference` screenshots. This is available via the `tt-clean-screenshots` cli or the `clean-screenshots` javascript function.

`tt-wdio` will call this before calling its test runner, such that the generated screenshot within your project are from the only the latest test run(s).

#### API
| Name  | Default Value | Description |
| ------------- | ------------- | ------------- |
| **--config**  | `undefined` | The wdio config path for the tests.  |
| **--removeReference**  | `false` | Whether or not to remove the reference screenshots. |

If no config is supplied to `tt-clean-screenshots`, `tt-clean-screenshots` will first search for `wdio.conf.js` in the working directory. If that is not found, it will attempt to use the default wdio config supplied by terra-dev-site.

#### CLI Usage
```JSON
{
  "clean-screenshots": "tt-clean-screenshots --config ./wdio.conf.js"
}
```

#### Function Usage
```
const cleanScreenshots = require('terra-toolkit/scripts/wdio/clean-screenshots');

cleanScreenshots({
    configPath: './wdio.conf.js',
    updateReference: false
});
```
