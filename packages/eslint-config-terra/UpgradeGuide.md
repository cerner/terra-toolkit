# Eslint Config Terra Upgrade Guide

## Changes from version 3 to version 4

### Project Name Updated with @cerner Scope

The project will need to be updated from eslint-config-terra to @cerner/eslint-config-terra in the devDependency list in package.json. The eslint config then becomes:

```diff
{
  "eslintConfig": {
-    "extends": "terra"
+    "extends": "@cerner/terra"
  },
}
```

### Upgrade Node

This version of eslint-config-terra drops support for Node 8.x.x. Projects will need to be upgraded to at least Node 10.

### Fix New Eslint Errors

Several new and updated rules were added in this new version so any new errors will need to be fixed. For reference the big change was updating eslint-plugin-react from [7.14.3 to 7.19.0](https://github.com/yannickcr/eslint-plugin-react/compare/v7.14.3...v7.19.0). Those changes include:
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.15.0
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.15.1
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.16.0
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.17.0
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.18.0
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.18.1
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.18.2
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.18.3
* https://github.com/yannickcr/eslint-plugin-react/releases/tag/v7.19.0
