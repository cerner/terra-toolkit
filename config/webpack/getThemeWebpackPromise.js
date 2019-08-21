const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rtl = require('postcss-rtl');
const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const Logger = require('../../scripts/utils/logger');

module.exports = (rootPath, themeFile) => {
  const cachedObject = {
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
    const compiler = webpack({
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
                  modules: 'global',
                  importLoaders: 2,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
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
    });
    compiler.outputFileSystem = new MemoryFS();
    compiler.run((error) => {
      if (error) {
        Logger.error(error);
        reject(error);
        return;
      }

      resolve(cachedObject);
    });
  });
};
