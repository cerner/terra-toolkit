const fs = require('fs-extra');
const rules = require('./rules');
const PackageIssues = require('./issues/PackageIssues');
const AggregateIssues = require('./issues/AggregateIssues');
const { getRuleConfig, getConfig } = require('./config');
const { getPathsForPackages } = require('./utilities');

const lint = ({ packageJsonData, config }) => {
  const issues = [];
  Object.entries(config.rules).forEach(([ruleId, ruleInformation]) => {
    const rule = rules[ruleId];
    const ruleConfig = getRuleConfig({ rule, ruleInformation });
    if (ruleConfig.severity !== 'off') {
      const issue = rule.lint({ packageJsonData, ruleConfig });
      if (issue) {
        issues.push(issue);
      }
    }
  });
  return issues;
};

const lintPackageJsonFile = async ({ packageJsonPath, config }) => {
  const packageJsonData = await fs.readJson(packageJsonPath);
  return lint({ packageJsonData, config });
};

module.exports = async () => {
  const config = await getConfig();
  const paths = await getPathsForPackages();
  const packagesIssues = await Promise.all(paths.map(async (packageJsonPath) => {
    const results = await lintPackageJsonFile({ packageJsonPath, config });
    return new PackageIssues({ packageJsonPath, results });
  }));
  const aggregateIssues = new AggregateIssues({ packagesIssues });
  if (aggregateIssues.errorCount || aggregateIssues.warningCount) {
    // eslint-disable-next-line no-console
    console.log(aggregateIssues.toString());
    if (aggregateIssues.errorCount) {
      process.exitCode = 1;
    }
  }
};
