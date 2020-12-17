/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const path = require('path');
const {
  LocalPackageAliasPlugin,
} = require('terra-dev-site');

const WebpackConfigTerra = require('./packages/webpack-config-terra/lib/webpack.config');
const TerraRenderApplicationPlugin = require('./packages/terra-render-application-plugin/src/index');
/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = () => {
  const processPath = process.cwd();
  return {
    plugins: [
      new TerraRenderApplicationPlugin({
        entry: './entry.jsx',
        title: 'title',
      }),
    ],
    resolve: {
      plugins: [
        new LocalPackageAliasPlugin({
          rootDirectories: [
            processPath,
            path.resolve(processPath, 'packages', '*'),
          ],
        }),
      ],
    },
  };
};
const webpackConfig = (env, argv) => (
  merge(WebpackConfigTerra(env, argv), devSiteConfig(env, argv))
);
module.exports = webpackConfig;
