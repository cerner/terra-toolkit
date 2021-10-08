const requireIe10CompatibleDependencyVersions = require('../../../src/rules/require-ie10-compatible-dependency-versions');

describe('require-ie10-compatible-dependency-versions', () => {
  it('succeeds when there are no dependencies', () => {
    const results = requireIe10CompatibleDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warn',
        },
      },
      projectType: 'module',
    }).dependencies({});
    expect(results).toMatchSnapshot();
  });

  it('succeeds when there are dependencies not in the list to check', () => {
    const results = requireIe10CompatibleDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warn',
        },
      },
      projectType: 'module',
    }).dependencies({
      a: '^1.0.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('fails as a warning when versions do not meet the IE10 compatible version', () => {
    let results;
    requireIe10CompatibleDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warn',
        },
      },
      projectType: 'module',
      report: (issues) => {
        results = issues;
      },
    }).dependencies({
      redux: '^5.0.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('fails when versions do not meet the IE10 compatible version', () => {
    let results;
    requireIe10CompatibleDependencyVersions.create({
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
      uuid: '7.x.x',
    });
    expect(results).toMatchSnapshot();
  });

  it('passes when all versions meet the IE10 compatible version', () => {
    const results = requireIe10CompatibleDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warn',
        },
      },
      projectType: 'module',
    }).dependencies({
      redux: '<3.0.0',
      axios: '<0.18.1',
      uuid: '<6.0.0',
    });
    expect(results).toMatchSnapshot();
  });

  it('succeeds when versions do not meet the IE10 compatible version but package is passed in the allowList', () => {
    const results = requireIe10CompatibleDependencyVersions.create({
      ruleConfig: {
        severity: {
          severityType: 'warn',
          allowList: ['redux'],
        },
      },
      projectType: 'module',
    }).dependencies({
      redux: '^4.0.0',
    });
    expect(results).toMatchSnapshot();
  });
});
