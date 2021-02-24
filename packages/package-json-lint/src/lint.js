const fs = require('fs-extra');
const callbackGlob = require('glob');
const util = require('util');
const path = require('path');
const ignore = require('ignore');
const rules = require('./rules');
const PackageIssues = require('./issues/PackageIssues');
const AggregateIssues = require('./issues/AggregateIssues');

const IGNORE_FILE_PATH = path.join(process.cwd(), '.packagejsonlintignore');

const glob = util.promisify(callbackGlob);

const getIgnorer = async () => {
  const ignoreFileContents = await fs.readFile(IGNORE_FILE_PATH, 'utf8');
  return ignore().add(ignoreFileContents);
};

const getPathsForPackages = async () => {
  const paths = await glob(path.join(process.cwd(), '**', 'package.json'), { ignore: [path.join('**', 'node_modules', '**')] });
  const ignorer = await getIgnorer();
  return paths.filter(currentPath => !ignorer.ignores(path.relative(process.cwd(), currentPath)));
};

const getConfig = async () => ({
  rules: {
    'require-no-terra-base-peer-dependency-versions': 'error',
    'require-theme-context-versions': 'error',
  },
});

const getRuleConfig = ({ ruleInformation }) => (
  { severity: ruleInformation }
);

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
