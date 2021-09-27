const devDependencySet = [
  '@babel/cli',
  '@babel/core',
  '@babel/helpers',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-async-generators',
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-transform-runtime',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/register',
  '@cerner/terra-application',
  '@cerner/terra-dev-site',
  '@octokit/core',
  'bufferutil',
  'commander',
  'danger',
  'enzyme',
  'enzyme-adapter-react-16',
  'enzyme-to-json',
  'eslint',
  'html-webpack-plugin',
  'jest',
  'lerna',
  'link-parent-bin',
  'memory-fs',
  'postcss',
  'react',
  'react-dom',
  'react-intl',
  'stylelint',
  'utf-8-validate',
  'webpack',
  'webpack-cli',
  'webpack-dev-server',
  '@cerner/terra-cli',
  'strip-ansi',
  'yargs',
  'chai',
  'lodash.groupby',
  'lodash.map',
  'lodash.mapkeys',
  'lodash.mapvalues',
  'mocha',
  'nock',
  'np',
  'sinon',
  '@babel/plugin-transform-object-assign',
  '@cerner/browserslist-config-terra',
  '@cerner/eslint-config-terra',
  '@cerner/jest-config-terra',
  '@cerner/stylelint-config-terra',
  '@cerner/terra-aggregate-translations',
  '@cerner/terra-functional-testing',
  '@cerner/terra-open-source-scripts',
  '@cerner/webpack-config-terra',
  'check-installed-dependencies',
  'core-js',
  'gh-pages',
  'glob',
  'ky',
  'react-test-renderer',
  'regenerator-runtime',
  'terra-application',
  'terra-disclosure-manager',
  'terra-enzyme-intl',
  'webpack-merge',
  'csvtojson',
  'jsdom',
  'one-cerner-style-icons',
  'shelljs',
  'svgo',
  'terra-button',
];

module.exports = {
  create: ({ ruleConfig, projectType, report }) => ({
    dependencies: (dependencies) => {
      const messageString = 'require-no-unnecessary-dependencies';
      if (projectType !== 'devModule') {
        const currentProblems = Object.keys(dependencies).map((dependency) => {
          const dependencyVersion = dependencies[dependency];
          if (devDependencySet.includes(dependency)) {
            return `${dependency}@${dependencyVersion} does not satisfy requirement for ${messageString} rule.`;
          }
          return undefined;
        }).filter(problem => !!problem);

        if (currentProblems.length) {
          const lintMessage = `This project has unnecessary dependencies that violates the ${messageString} rule:\n  ${currentProblems.join('\n  ')}`;
          report({
            lintId: messageString, severity: ruleConfig.severity.severityType, lintMessage, projectType,
          });
        }
      }
    },
    peerDependencies: (peerDependencies) => {
      const messageString = 'require-no-unnecessary-dependencies';
      if (projectType !== 'devModule') {
        const currentProblems = Object.keys(peerDependencies).map((dependency) => {
          const dependencyVersion = peerDependencies[dependency];
          if (devDependencySet.includes(dependency)) {
            return `${dependency}@${dependencyVersion} does not satisfy requirement for ${messageString} rule.`;
          }
          return undefined;
        }).filter(problem => !!problem);

        if (currentProblems.length) {
          const lintMessage = `This project has unnecessary peerDependencies that violates the ${messageString} rule:\n  ${currentProblems.join('\n  ')}`;
          report({
            lintId: messageString, severity: ruleConfig.severity.severityType, lintMessage, projectType,
          });
        }
      }
    },
  }),
};
