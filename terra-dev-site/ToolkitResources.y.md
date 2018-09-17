# Orion Toolkit Wdio Helper

## Wdio Runner
Orion Toolkit offers its own wdio test runner wrapper around the Terra Toolkit wdio test runner with defaults that are utilized in CI for Orion projects.  For more information see the [terra-toolkit documentation](https://github.com/cerner/terra-toolkit/blob/master/scripts/wdio/README.md)

Orion's wdio test runner is available via the `ot-wdio` cli.

#### API
| Name  | Default Value | Description |
| ------------- | ------------- | ------------- |
| **--no-grid** | `false` | Whether or not to run tests against the orion internal selenium grid. |
| **--browsers** | `undefined` | Which browsers to run against if using the selenium grid (defaults to undefined which is all browsers). |
| **--config**  | `undefined` | The wdio config path for the tests.  |
| **--formFactors**  | `['tiny','small','medium','large','huge','enormous']` | The list of viewport sizes to test. |
| **--locales** | `['de','en','en-GB','es','fr','pt']` | The list of locales to test. |
| **--continueOnFail** | `undefined` | Whether or not to execute all test runs when a run fails. |
| **--updateReference** | `undefined` | Whether or not to remove reference screenshots during screenshot cleanup. CLI use only. |
| **--port**  | `undefined` | [wdio option] The selenium server port. |
| **--host** | `undefined` | [wdio option] The selenium server host address. |
| **--baseUrl** | `undefined` | [wdio option] The base URL. |
| **--suite** | `undefined  ` | [wdio option] The suite to run. |
| **--spec** | `undefined` | [wdio option] The spec file to run. |
