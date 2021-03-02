/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const {
  TerraDevSite,
} = require('@cerner/terra-dev-site');

const WebpackConfigTerra = require('./packages/webpack-config-terra/lib/webpack.config');

const coreConfig = (env = {}) => ({
  plugins: [
    new TerraDevSite({
      defaultLocale: env.defaultLocale,
    }),
  ],
});

const mergedConfig = (env, argv) => (
  merge(WebpackConfigTerra(env, argv), coreConfig())
);

module.exports = mergedConfig;
