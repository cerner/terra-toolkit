/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const path = require('path');
const {
  TerraDevSite,
} = require('@cerner/terra-dev-site');

const WebpackConfigTerra = require('./packages/webpack-config-terra/webpack.config');
/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}) => ({
  plugins: [
    new TerraDevSite({
      defaultLocale: env.defaultLocale,
      primaryNavigationItems: [{
        path: '/home',
        label: 'Home',
        contentExtension: 'home',
        additionalContent: [
          {
            label: 'Home',
            filePath: path.resolve(process.cwd(), 'README.md'),
          },
        ],
      }, {
        path: '/application',
        label: 'Application',
        contentExtension: 'app',
      }, {
        path: '/components',
        label: 'Components',
        contentExtension: 'doc',
      }, {
        path: '/dev_tools',
        label: 'Developer Tools',
        contentExtension: 'tool',
      }, {
        path: '/guides',
        label: 'Guides',
        contentExtension: 'guide',
      }, {
        path: '/tests',
        label: 'Tests',
        contentExtension: 'test',
      }],
    }),
  ],
});
const webpackConfig = (env, argv) => (
  merge(WebpackConfigTerra(env, argv), devSiteConfig(env, argv))
);
module.exports = webpackConfig;
