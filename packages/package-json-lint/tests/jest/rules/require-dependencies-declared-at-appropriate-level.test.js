const requireDependenciesDeclaredAtAppropriateLevel = require('../../../src/rules/require-dependencies-declared-at-appropriate-level');

describe('require-dependencies-declared-at-appropriate-level', () => {
  describe('when projectType is application', () => {
    it('fails as a warning when there unnecessary dependencies/peerDependencies', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
          },
        },
        projectType: 'application',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        '@cerner/webpack-config-terra': '^2.0.0',
      });
      rule.peerDependencies({
        jest: '^26.6.2',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there are no unnecessary dependencies/peerDependencies', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
          },
        },
        projectType: 'application',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        classnames: '^2.2.5',
      });
      rule.peerDependencies({
        react: '^16.8.5',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when unnecessary dependencies/peerDependencies are passed in the allowList', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
            allowList: ['@cerner/webpack-config-terra', 'jest'],
          },
        },
        projectType: 'application',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        '@cerner/webpack-config-terra': '^2.0.0',
      });
      rule.peerDependencies({
        jest: '^26.6.2',
      });
      expect(results).toMatchSnapshot();
    });
  });

  describe('when projectType is module', () => {
    it('fails as a warning when there unnecessary dependencies/peerDependencies', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
          },
        },
        projectType: 'module',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        webpack: '^4.30.0',
      });
      rule.peerDependencies({
        jest: '^26.6.2',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there are no unnecessary dependencies/peerDependencies', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
          },
        },
        projectType: 'module',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        classnames: '^2.2.5',
      });
      rule.peerDependencies({
        react: '^16.8.5',
      });
      expect(results).toMatchSnapshot();
    });
  });

  describe('when projectType is devModule', () => {
    it('succeeds when there unnecessary dependencies/peerDependencies', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
          },
        },
        projectType: 'devModule',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        '@cerner/webpack-config-terra': '^2.0.0',
      });
      rule.peerDependencies({
        jest: '^26.6.2',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there no unnecessary dependencies/peerDependencies', () => {
      const results = [];
      const rule = requireDependenciesDeclaredAtAppropriateLevel.create({
        ruleConfig: {
          severity: {
            severityType: 'warn',
          },
        },
        projectType: 'devModule',
        report: (issues) => {
          results.push(issues);
        },
      });
      rule.dependencies({
        classnames: '^2.2.5',
      });
      rule.peerDependencies({
        react: '^16.8.5',
      });
      expect(results).toMatchSnapshot();
    });
  });
});
