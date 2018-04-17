const commander = require('commander');
const serve = require('./serve-static');

const packageJson = require('../../package.json');
const loadDefaultWebpackConfig = require('./loadDefaultWebpackConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.', undefined)
  .option('--port <n>', 'The port the app should listen on', parseInt)
  .option('-p, --production', 'Passes the -p flag to the webpack config, if available.')
  .option('--site <path>', 'The relative path to the static site. This takes precidence over webpack config if both are passed.', undefined)
  .option('--vfs', 'The webpack assets will be written to a virtual file system instead of disk.')
  .parse(process.argv);

const port = commander.port || process.env.PORT;

serve({
  config: loadDefaultWebpackConfig(commander.config),
  site: commander.site,
  vfs: commander.vfs,
  port,
  production: commander.production,
});
