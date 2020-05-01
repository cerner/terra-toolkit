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

### Fix New Eslint Errors

Several new and updated rules were added in this new version so any new errors will need to be fixed.
