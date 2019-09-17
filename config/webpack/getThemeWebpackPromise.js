const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rtl = require('postcss-rtl');
const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const Logger = require('../../scripts/utils/logger');

/**
 * This is a basic configuration to webpack just the theme file and grab the resulting css.  Thus,
 * there are no JS, raw, etc. loaders. The resulting themeable variables and values will be populated in
 * the cachedObject. Note this will not support hot reloading. This is a very trimmed down config from
 * what we normally do.
 * @param {String} rootPath the root path from where the webpack is being run
 * @param {String} themeFile the file to be webpacked
 * @param {Object} cachedObject this object will be populated with the resulting themeable variables and values
 */
const themeConfig = (rootPath, themeFile, cachedObject) => (
  {
    mode: 'production',
    entry: {
      theme: themeFile,
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'global',
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // Add unique ident to prevent the loader from searching for a postcss.config file. See: https://github.com/postcss/postcss-loader#plugins
                ident: 'postcss',
                plugins() {
                  return [
                    rtl(),
                    Autoprefixer(),
                  ];
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'temp-themes.css',
        ignoreOrder: true,
      }),
      new PostCSSAssetsPlugin({
        test: /\.css$/,
        log: false,
        plugins: [
          PostCSSCustomProperties({
            preserve: true,
            // Here is where the cachedObject is populated
            exportTo: [
              cachedObject,
            ],
          }),
        ],
      }),
    ],
    resolve: {
      extensions: ['.js'],
    },
    resolveLoader: {
      modules: [path.resolve(path.join(rootPath, 'node_modules'))],
    },
  }
);

/**
 * Gets a promise that performs webpack on the theme file. The promise resolves with an object that contains the
 * themeable variables and values.
 * @param {String} rootPath the root path from where the webpack is being run
 * @param {String} themeFile the file to be webpacked
 */
module.exports = (rootPath, themeFile) => {
  const cachedObject = {
    // Provide our own toJSON as the default inserts commas in between things like inset values which is invalid CSS
    toJSON: customProperties => (
      Object.keys(customProperties).reduce((customPropertiesJSON, key) => {
        const aggregatedCustomPropertiesJSON = customPropertiesJSON;
        aggregatedCustomPropertiesJSON[key] = customProperties[key].map(customPropertyComponent => String(customPropertyComponent)).join(' ');
        return aggregatedCustomPropertiesJSON;
      }, {})
    ),
    customProperties: {},
  };
  return new Promise((resolve, reject) => {
    const compiler = webpack(themeConfig(rootPath, themeFile, cachedObject));
    // Set the output file system to MemoryFS so that this all runs in memory
    compiler.outputFileSystem = new MemoryFS();
    compiler.run((error, stats) => {
      if (error) {
        Logger.error(error.stack || error);
        if (error.details) {
          Logger.error(error.details);
        }
        reject(error);
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        Logger.error(info.errors);
        reject(info.errors);
        return;
      }

      if (stats.hasWarnings()) {
        Logger.warn(info.warnings);
      }

      resolve(cachedObject);
    });
  });
};
