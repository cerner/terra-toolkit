const webpack = require('webpack');

const getDefineBuildStatsPlugin = () => (
  new webpack.DefinePlugin({
    __PACKAGE_VERSION__: JSON.stringify(process.env.npm_package_version),
    __WEBPACK_BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  })
);

module.exports = getDefineBuildStatsPlugin;
