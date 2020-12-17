/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * Updates the webpack options with defaults that terra-dev-site requires.
 */
class RenderApplicationPlugin {
  constructor({
    entry,
    title,
  }) {
    const processPath = process.cwd();
    // Apply defaults to the config.
    console.log('entry', entry);
    console.log('processPath', processPath);
    this.entry = path.resolve(processPath, entry);
    console.log('this.entry', this.entry);
    this.entryKey = 'index';
    this.resourceQuery = '?terra-entry';
    this.htmlFileName = 'index.html';
    // this.url = '/';
    this.title = title;
  }

  apply(compiler) {
    const isWebpack5 = compiler.webpack && compiler.webpack.version.startsWith('5');

    // Map to what we want to send to site config

    let webpackConfig = {
      entry: {
        [this.entryKey]: path.join(__dirname, 'templates', `entry.template${this.resourceQuery}`),
      },
      module: {
        rules: [
          {
            // This loader generates the entrypoint and sets up the config template path and resource query.
            resourceQuery: this.resourceQuery,
            use: [
              {
                loader: 'terraRenderApplicationEntry',
                options: {
                  entryPath: this.entry,
                },
              },
            ],
          },
        ],
      },
      // add the path to search for dev site loaders
      resolveLoader: {
        modules: [
          path.resolve(__dirname, 'loaders'),
          'node_modules',
        ],
      },
    };

    // If this plugin is used with webpack 5 we must normalize the webpack config.
    if (isWebpack5) {
      webpackConfig = compiler.webpack.config.getNormalizedWebpackOptions(webpackConfig);
    }

    // ENTRY
    compiler.options.entry = {
      ...compiler.options.entry,
      ...webpackConfig.entry,
    };

    // MODULE
    // we know there is a oneOf here because we just added it.
    compiler.options.module.rules.unshift(webpackConfig.module.rules[0]);

    // RESOLVE LOADER
    compiler.options.resolveLoader.modules = webpackConfig.resolveLoader.modules;

    // Generate the index.html file for the site.
    new HtmlWebpackPlugin({
      title: this.title,
      filename: this.htmlFileName,
      template: path.join(__dirname, 'templates', 'index.html'),
    }).apply(compiler);
  }
}

module.exports = RenderApplicationPlugin;
