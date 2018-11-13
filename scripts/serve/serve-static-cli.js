const commander = require('commander');
const serve = require('./serve-static');

const packageJson = require('../../package.json');
const loadWebpackConfig = require('./loadWebpackConfig');


// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config [path]', 'The webpack config to serve. Alias for <config>.', undefined)
  .option('--port [number]', 'The port the app should listen on', 8080)
  .option('--host [string]', 'Sets the host that the server will listen on. eg. \'10.10.10.1\'', '0.0.0.0')
  .option('-p, --production', 'Passes the -p flag to the webpack config, if available.')
  .option('--site [path]', 'The relative path to the static site. This takes precidence over webpack config if both are passed.', undefined)
  .option('--disk', 'The webpack assets will be written to disk instead of a virtual file system.')
  .parse(process.argv);

serve({
  config: loadWebpackConfig(commander.config),
  disk: commander.disk,
  host: commander.host,
  port: Number(commander.port),
  production: commander.production,
  site: commander.site,
});
