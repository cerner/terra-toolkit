const requireThemeContextVersions = require('./require-theme-context-versions');
const requireNoTerraBasePeerDependencyVersions = require('./require-no-terra-base-peer-dependency-versions');
const requireNoHardCodedDependencyVersions = require('./require-no-hard-coded-dependency-versions');
const requireIe10CompatibleDependencyVersions = require('./require-ie10-compatible-dependency-versions');

module.exports = {
  'require-ie10-compatible-dependency-versions': requireIe10CompatibleDependencyVersions,
  'require-no-terra-base-peer-dependency-versions': requireNoTerraBasePeerDependencyVersions,
  'require-theme-context-versions': requireThemeContextVersions,
  'require-no-hard-coded-dependency-versions': requireNoHardCodedDependencyVersions,
};
