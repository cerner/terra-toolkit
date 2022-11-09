/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const {
  TerraDevSite,
} = require('@cerner/terra-dev-site');

const WebpackConfigTerra = require('@cerner/webpack-config-terra');

const coreConfig = (env = {}) => ({
  plugins: [
    new TerraDevSite({
      defaultLocale: env.defaultLocale,
      primaryNavigationItems: [{
        path: '/home',
        text: 'Home',
        contentExtension: 'home',
      }, {
        path: '/components',
        text: 'Components',
        contentExtension: 'doc',
      }, {
        path: '/dev_tools',
        text: 'Developer Tools',
        contentExtension: 'tool',
      }, {
        path: '/tests',
        text: 'Tests',
        contentExtension: 'test',
      }],
    }),
  ],
});

const mergedConfig = (env, argv) => (
  merge(WebpackConfigTerra(env, argv), coreConfig(env))
);

module.exports = mergedConfig;
