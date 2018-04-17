const commander = require('commander');
const path = require('path');
const serve = require('./serve-static');

const packageJson = require('../../package.json');
const defaultWebpackConfig = require('./defaultWebpackConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.')
  .option('--port <n>', 'The port the app should listen on', parseInt)
  .option('-p, --production', 'Passes the -p flag to the webpack config, if available.')
  .option('--site <path>', 'The relative path to the static site. This takes precidence over webpack config if both are passed.')
  .option('--vfs', 'The webpack assets will be written to a virtual file system instead of disk.')
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
  site: commander.site,
  vfs: commander.vfs,
  port: commander.port,
});
