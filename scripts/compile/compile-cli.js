const commander = require('commander');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const packageJson = require('../../package.json');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.')
  .parse(process.argv);

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());


let config;

if (commander.config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require(path.resolve(commander.config));
}

if (!config) {
  const localPath = path.resolve(process.cwd(), 'webpack.config.js');
  if (isFile(localPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = require(localPath);
  }
}

if (!config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require('../../src/webpack/webpack.config');
}

// Promise((resolve, reject) => {
const compiler = webpack(config);
compiler.run((err, stats) => {
  // if (err || stats.hasErrors()) {
  //   reject();
  // }
  // resolve(compiler.outputFileSystem);
});
// });
