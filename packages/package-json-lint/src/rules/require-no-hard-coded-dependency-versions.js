const semver = require('semver');

const documentation = {
  ruleName: 'require-no-hard-coded-dependency-versions',
  defaultValue: 'error',
  description: "This rule doesn't allow any hard-coded dependencies to be passed in the package.json. Only applies for module and devModule.",
};

module.exports = {
  create: ({ ruleConfig, projectType, report }) => ({
    dependencies: (dependencies) => {
      if (projectType === 'module' || projectType === 'devModule') {
        const messageString = 'require-no-hard-coded-dependency-versions';
        const currentProblems = Object.keys(dependencies).map(dependencyName => {
          const dependencyVersion = dependencies[dependencyName];
          const isCompatibleVersion = semver.clean(dependencyVersion) === null;
          if (!isCompatibleVersion && !(ruleConfig.severity.allowList && ruleConfig.severity.allowList.includes(dependencyName))) {
            return `${dependencyName}@${dependencyVersion} does not satisfy requirement for the ${messageString} rule.`;
          }
          return undefined;
        }).filter(problem => !!problem);

        if (currentProblems.length) {
          const lintMessage = `The dependencies for this project have hard-coded versions that violates the ${messageString} rule:\n  ${currentProblems.join('\n  ')}`;
          report({
            lintId: messageString, severity: ruleConfig.severity.severityType, lintMessage, projectType,
          });
        }
      }
    },
  }),
  documentation,
};
