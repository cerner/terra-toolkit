# Terra Functional Testing - Version 2 Upgrade Guide

The only change in this version is the upgrade to WebDriverIO v7. This should cause very little disruption to consuming projects.

## Breaking Changes

### WDIO v6 to v7

A complete list of breaking changes can be found here:

- [WebdriverIO v7 Breaking Changes](https://github.com/webdriverio/webdriverio/blob/main/CHANGELOG.md#boom-breaking-change)
- [WebdriverIO v6 to v7 Upgrade Guide](https://webdriver.io/docs/v7-migration)

If you are using `@cerner/terra-functional-testing` along with it's `wdio.config.js` most of these changes should not apply.

### Node 10 support dropped

WDIO v7 updates to fibers v5 which drops support for Node 10. Node 12 and above are recommended.

#### Update package.json

You will need to update the `@cerner/terra-functional-testing` version in your `package.json`:

```diff
// package.json
{
  "devDependencies": {
+   "@cerner/terra-functional-testing": "^2.0.0",
-   "@cerner/terra-functional-testing": "^1.0.0"
  }
}
```
