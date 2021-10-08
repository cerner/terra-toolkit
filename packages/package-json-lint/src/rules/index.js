const requireThemeContextVersions = require('./require-theme-context-versions');
const requireNoTerraBasePeerDependencyVersions = require('./require-no-terra-base-peer-dependency-versions');
const requireDependenciesDeclaredAtAppropriateLevel = require('./require-dependencies-declared-at-appropriate-level');
const requireNoHardCodedDependencyVersions = require('./require-no-hard-coded-dependency-versions');

module.exports = {
  'require-dependencies-declared-at-appropriate-level': requireDependenciesDeclaredAtAppropriateLevel,
  'require-no-hard-coded-dependency-versions': requireNoHardCodedDependencyVersions,
  'require-no-terra-base-peer-dependency-versions': requireNoTerraBasePeerDependencyVersions,
  'require-theme-context-versions': requireThemeContextVersions,
};
