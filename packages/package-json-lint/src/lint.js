const fs = require('fs-extra');
const rules = require('./rules');
const PackageIssues = require('./issues/PackageIssues');
const AggregateIssues = require('./issues/AggregateIssues');
const { getRuleConfig, getConfig } = require('./config');
const { getPathsForPackages } = require('./utilities');

const lint = ({ packageJsonData, config }) => {
  const issues = [];
  const rulesToRun = Object.entries(config.rules).map(([ruleId, ruleInformation]) => {
    const rule = rules[ruleId];
    const ruleConfig = getRuleConfig({ rule, ruleInformation });
    if (ruleConfig.severity !== 'off') {
      return rule.create({ ruleConfig, report: issue => issues.push(issue) });
    }
    return undefined;
  }).filter(rule => !!rule);

  Object.entries(packageJsonData).forEach(([node, value]) => {
    rulesToRun.forEach((rule) => {
      const nodeFunction = rule[node];
      if (nodeFunction) {
        nodeFunction(value);
      }
    });
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
