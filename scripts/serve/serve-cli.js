const commander = require('commander');
const path = require('path');
const serve = require('./serve');

const packageJson = require('../../package.json');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.')
  .option('--port <n>', 'The port the app should listen on', parseInt)
  .parse(process.argv);

let config;

if (commander.config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require(path.resolve(commander.config));
}

// if (!config) {
//   const localPath = path.resolve(process.cwd(), 'webpack.config.js');
//   if (isFile(localPath)) {
//     // eslint-disable-next-line global-require, import/no-dynamic-require
//     config = require(localPath);
//   }
// }

serve({ config, port: commander.port });
