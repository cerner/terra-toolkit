const requireNoTerraBasePeerDependencyVersions = require('../../../src/rules/require-no-hard-coded-dependency-versions');

describe('require-no-hard-coded-dependency-versions', () => {
  describe('when projectType is application', () => {
    it('succeeds when there are hardcoded dependencies', () => {
      const results = requireNoTerraBasePeerDependencyVersions.create({
        ruleConfig: {
          severity: 'error',
        },
        projectType: 'application',
      }).dependencies({
        a: '1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there are no hardcoded dependencies', () => {
      const results = requireNoTerraBasePeerDependencyVersions.create({
        ruleConfig: {
          severity: 'error',
        },
        projectType: 'application',
      }).dependencies({
        a: '^1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
  });

  describe('when projectType is module', () => {
    it('fails when there are hardcoded dependencies', () => {
      let results;
      requireNoTerraBasePeerDependencyVersions.create({
        ruleConfig: {
          severity: 'error',
        },
        projectType: 'module',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there are no hardcoded dependencies', () => {
      let results = requireNoTerraBasePeerDependencyVersions.create({
        ruleConfig: {
          severity: 'error',
        },
        projectType: 'module',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '^1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
  });

  describe('when projectType is devModule', () => {
    it('fails when there are hardcoded dependencies', () => {
      let results;
      requireNoTerraBasePeerDependencyVersions.create({
        ruleConfig: {
          severity: 'error',
        },
        projectType: 'devModule',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there are no hardcoded dependencies', () => {
      const results = requireNoTerraBasePeerDependencyVersions.create({
        ruleConfig: {
          severity: 'error',
        },
        projectType: 'devModule',
      }).dependencies({
        a: '^1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
  });
});
