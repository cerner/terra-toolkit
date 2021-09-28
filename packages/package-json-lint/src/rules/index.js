const requireThemeContextVersions = require('./require-theme-context-versions');
const requireNoTerraBasePeerDependencyVersions = require('./require-no-terra-base-peer-dependency-versions');
const requireNoUnnecessaryDependency = require('./require-no-unnecessary-dependency');
const requireNoHardCodedDependencyVersions = require('./require-no-hard-coded-dependency-versions');

module.exports = {
  'require-no-terra-base-peer-dependency-versions': requireNoTerraBasePeerDependencyVersions,
  'require-no-unnecessary-dependency': requireNoUnnecessaryDependency,
  'require-theme-context-versions': requireThemeContextVersions,
  'require-no-hard-coded-dependency-versions': requireNoHardCodedDependencyVersions,
};
