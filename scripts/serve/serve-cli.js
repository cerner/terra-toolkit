const commander = require('commander');
const path = require('path');
const serve = require('./serve');

const packageJson = require('../../package.json');
const defaultWebpackConfig = require('./defaultWebpackConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve.')
  .option('--port <n>', 'The port the server should listen on.', parseInt)
  .option('-p, --production', 'Passes the -p flag to the webpack config')
  .parse(process.argv);

let config;

if (commander.config) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require(path.resolve(commander.config));
} else {
  config = defaultWebpackConfig();
}

serve({
  config,
  port: commander.port,
  production: commander.production,
});
