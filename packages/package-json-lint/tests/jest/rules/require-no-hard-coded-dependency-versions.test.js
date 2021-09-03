const requireNoHardCodedDependencyVersions = require('../../../src/rules/require-no-hard-coded-dependency-versions');

describe('require-no-hard-coded-dependency-versions', () => {
  describe('when projectType is application', () => {
    it('succeeds when there are hardcoded dependencies', () => {
      let results;
      requireNoHardCodedDependencyVersions.create({
        ruleConfig: {
          severity: {
            severityType: 'error',
          },
        },
        projectType: 'application',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
    it('succeeds when there are no hardcoded dependencies', () => {
      let results;
      requireNoHardCodedDependencyVersions.create({
        ruleConfig: {
          severity: {
            severityType: 'error',
          },
        },
        projectType: 'application',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '^1.0.0',
      });
      expect(results).toMatchSnapshot();
    });
  });

  describe('when projectType is module', () => {
    it('fails when there are hardcoded dependencies', () => {
      let results;
      requireNoHardCodedDependencyVersions.create({
        ruleConfig: {
          severity: {
            severityType: 'error',
          },
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
      let results;
      requireNoHardCodedDependencyVersions.create({
        ruleConfig: {
          severity: {
            severityType: 'error',
          },
        },
        projectType: 'module',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '^1.0.0',
        b: '1.0.0 - 2.9999.9999',
        c: '>=1.0.2 <2.1.2',
        d: '>1.0.2 <=2.3.4',
        e: '<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0',
        f: '~1.2',
        g: 'latest',
        h: '~1.2.3',
        i: '2.x',
        j: '3.3.x',
      });
      expect(results).toMatchSnapshot();
    });
  });

  describe('when projectType is devModule', () => {
    it('fails when there are hardcoded dependencies', () => {
      let results;
      requireNoHardCodedDependencyVersions.create({
        ruleConfig: {
          severity: {
            severityType: 'error',
          },
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
      let results;
      requireNoHardCodedDependencyVersions.create({
        ruleConfig: {
          severity: {
            severityType: 'error',
          },
        },
        projectType: 'devModule',
        report: (issues) => {
          results = issues;
        },
      }).dependencies({
        a: '^1.0.0',
        b: '1.0.0 - 2.9999.9999',
        c: '>=1.0.2 <2.1.2',
        d: '>1.0.2 <=2.3.4',
        e: '<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0',
        f: '~1.2',
        g: 'latest',
        h: '~1.2.3',
        i: '2.x',
        j: '3.3.x',
      });
      expect(results).toMatchSnapshot();
    });
  });

  it('succeeds when hardcoded dependency is passed in the allowList', () => {
    let results;
    requireNoHardCodedDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'error',
          allowList: ['a'],
        },
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
});
