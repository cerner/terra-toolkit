# Terra Functional Testing - Version 2 Upgrade Guide

The only change in this version is the upgrade to WebDriverIO v7. This should cause very little disruption to consuming projects.

## Breaking Changes

### WDIO v6 to v7

A complete list of breaking changes can be found here:

- [WebdriverIO v7 Breaking Changes](https://github.com/webdriverio/webdriverio/blob/main/CHANGELOG.md#boom-breaking-change)
- [WebdriverIO v6 to v7 Upgrade Guide](https://github.com/webdriverio/webdriverio/blob/main/CHANGELOG.md#boom-breaking-change)

If you are using `@cerner/terra-functional-testing` along with it's `wdio.config.js` most of these changes should not apply.
The primary change you will need to make is updating the `@cerner/terra-functional-testing` version in your `package.json`:

```diff
// package.json
{
  "devDependencies": {
+   "@cerner/terra-functional-testing": "^2.0.0",
-   "@cerner/terra-functional-testing": "^1.0.0"
  }
}
```
