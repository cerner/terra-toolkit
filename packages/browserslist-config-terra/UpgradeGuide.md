# Browserslist Config Terra Upgrade Guide

## Changes from version 2 to version 3

### Project Name Updated with @cerner Scope

The project will need to be updated from browserslist-config-terra to @cerner/browserslist-config-terra in the devDependency list in package.json. The browserslist config then becomes:

```diff
{
  "browserslist": [
-    "extends browserslist-config-terra"
+    "extends @cerner/browserslist-config-terra"
  ]
}
```
