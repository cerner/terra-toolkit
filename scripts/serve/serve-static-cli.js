const commander = require('commander');
const serve = require('./serve-static');

const packageJson = require('../../package.json');
const loadWebpackConfig = require('./loadWebpackConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve. Alias for <config>.', undefined)
  .option('--port <n>', 'The port the app should listen on', parseInt)
  .option('-p, --production', 'Passes the -p flag to the webpack config, if available.')
  .option('--site <path>', 'The relative path to the static site. This takes precidence over webpack config if both are passed.', undefined)
  .option('--disk', 'The webpack assets will be written to disk instead of a virtual file system.')
  .parse(process.argv);

const port = commander.port || process.env.PORT;

serve({
  config: loadWebpackConfig(commander.config),
  site: commander.site,
  disk: commander.disk,
  port,
  production: commander.production,
});
