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