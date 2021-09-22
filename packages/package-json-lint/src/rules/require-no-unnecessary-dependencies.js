const devPeerDependencySet = [
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
  '@cerner/package-json-lint',
  '@cerner/stylelint-config-terra',
  '@cerner/terra-aggregate-translations',
  '@cerner/terra-application',
  '@cerner/terra-cli',
  '@cerner/terra-dev-site',
  '@cerner/terra-functional-testing',
  '@cerner/terra-open-source-scripts',
  '@cerner/webpack-config-terra',
  '@octokit/core',
  'bufferutil',
  'chai',
  'check-installed-dependencies',
  'commander',
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
  'intl',
  'jest',
  'jsdom',
  'ky',
  'lerna',
  'link-parent-bin',
  'lodash.groupby',
  'lodash.map',
  'lodash.mapkeys',
  'lodash.mapvalues',
  'memory-fs',
  'mocha',
  'nock',
  'np',
  'one-cerner-style-icons',
  'postcss',
  'react',
  'react-dom',
  'react-intl',
  'react-test-renderer',
  'regenerator-runtime',
  'shelljs',
  'sinon',
  'strip-ansi',
  'stylelint',
  'svgo',
  'terra-application',
  'terra-button',
  'terra-disclosure-manager',
  'terra-enzyme-intl',
  'utf-8-validate',
  'webpack',
  'webpack-cli',
  'webpack-dev-server',
  'webpack-merge',
  'yargs',
];

module.exports = {
  create: ({ ruleConfig, projectType, report }) => ({
    dependencies: (dependencies) => {
      const messageString = 'require-no-unnecessary-dependencies';
      if (projectType !== 'devModule') {
        const currentProblems = Object.keys(dependencies).map((dependency) => {
          const dependencyVersion = dependencies[dependency];
          if (devPeerDependencySet.includes(dependency)) {
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
  }),
};
