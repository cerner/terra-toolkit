module.exports = {
  create: ({ ruleConfig, projectType, report }) => ({
    dependencies: (dependencies) => {
      if (projectType === 'module' || projectType === 'devModule') {
        const messageString = 'no hard coded dependency version';
        const currentProblems = Object.keys(dependencies).map(dependencyName => {
          const dependencyVersion = dependencies[dependencyName];
          if (!dependencyVersion.startsWith('^')) {
            return `${dependencyName}@${dependencyVersion} does not satisfy requirement for ${messageString}`;
          }
          return undefined;
        }).filter(problem => !!problem);

        if (currentProblems.length) {
          const lintMessage = `The dependencies for this project have hard-coded versions for ${messageString}:\n  ${currentProblems.join('\n  ')}`;
          report({
            lintId: 'require-no-hard-coded-dependency-versions', severity: ruleConfig.severity, lintMessage, projectType,
          });
        }
      }
    },
  }),
};
