/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const path = require('path');
const { TerraDevSite } = require('@cerner/terra-dev-site');

const WebpackConfigTerra = require('./packages/webpack-config-terra/lib/webpack.config');

const coreConfig = (env = {}) => ({
  plugins: [
    new TerraDevSite({
      defaultLocale: env.defaultLocale,
      primaryNavigationItems: [{
        path: '/home',
        label: 'Home',
        contentExtension: 'home',
        additionalContent: [{
          title: 'Home',
          filePath: path.resolve(process.cwd(), 'README.md'),
        }],
      }, {
        path: '/components',
        label: 'Components',
        contentExtension: 'doc',
      }, {
        path: '/dev_tools',
        label: 'Developer Tools',
        contentExtension: 'tool',
      }, {
        path: '/tests',
        label: 'Tests',
        contentExtension: 'test',
      }],
    }),
  ],
});

const mergedConfig = (env, argv) => (
  merge(WebpackConfigTerra(env, argv), coreConfig())
);

module.exports = mergedConfig;
