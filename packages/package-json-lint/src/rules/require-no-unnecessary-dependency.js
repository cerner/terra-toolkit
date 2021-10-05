const devDependencySet = [
  '@babel/cli',
  '@babel/core',
  '@babel/helpers',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-async-generators',
  '@babel/plugin-transform-object-assign',
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-transform-runtime',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/register',
  '@cerner/browserslist-config-terra',
  '@cerner/eslint-config-terra',
  '@cerner/jest-config-terra',
  '@cerner/stylelint-config-terra',
  '@cerner/terra-aggregate-translations',
  '@cerner/terra-cli',
  '@cerner/terra-dev-site',
  '@cerner/terra-functional-testing',
  '@cerner/terra-open-source-scripts',
  '@octokit/core',
  'bufferutil',
  'chai',
  'check-installed-dependencies',
  'core-js',
  'csvtojson',
  'danger',
  'enzyme',
  'enzyme-adapter-react-16',
  'enzyme-to-json',
  'eslint',
  'gh-pages',
  'glob',
  'html-webpack-plugin',
  'jest',
  'jsdom',
  'ky',
  'lerna',
  'link-parent-bin',
  'memory-fs',
  'mocha',
  'nock',
  'np',
  'one-cerner-style-icons',
  'postcss',
  'react-test-renderer',
  'regenerator-runtime',
  'shelljs',
  'sinon',
  'strip-ansi',
  'stylelint',
  'svgo',
  'utf-8-validate',
  'webpack',
  'webpack-cli',
  'webpack-dev-server',
  'webpack-merge',
  'yargs',
];

function findUnnecessaryDependency(rule, dependencies, dependencyType) {
  const { ruleConfig, projectType, report } = rule;
  const messageString = 'require-no-unnecessary-dependency';
  if (projectType !== 'devModule') {
    const currentProblems = Object.keys(dependencies).map((dependency) => {
      const dependencyVersion = dependencies[dependency];
      if (devDependencySet.includes(dependency) && !(ruleConfig.severity.allowList && ruleConfig.severity.allowList.includes(dependency))) {
        return `${dependency}@${dependencyVersion} does not satisfy requirement for ${messageString} rule.`;
      }
      return undefined;
    }).filter(problem => !!problem);

    if (currentProblems.length) {
      let lintMessage;
      if (dependencyType === 'dependency') {
        lintMessage = `This project has unnecessary dependencies that violates the ${messageString} rule:\n  ${currentProblems.join('\n  ')}`;
      } else if (dependencyType === 'peer') {
        lintMessage = `This project has unnecessary peerDependencies that violates the ${messageString} rule:\n  ${currentProblems.join('\n  ')}`;
      }
      report({
        lintId: messageString,
        severity: ruleConfig.severity.severityType,
        lintMessage,
        projectType,
      });
    }
  }
}

module.exports = {
  create: ({
    ruleConfig,
    projectType,
    report,
  }) => ({
    dependencies: (dependencies) => {
      findUnnecessaryDependency({ ruleConfig, projectType, report }, dependencies, 'dependency');
    },
    peerDependencies: (peerDependencies) => {
      findUnnecessaryDependency({ ruleConfig, projectType, report }, peerDependencies, 'peer');
    },
  }),
};
