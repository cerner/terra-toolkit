const commander = require('commander');
const serve = require('./serve');

const packageJson = require('../../package.json');
const loadWebpackConfig = require('./loadWebpackConfig');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config [path]', 'The webpack config to serve.', undefined)
  .option('--host [string]', 'Sets the host that the server will listen on. eg. \'10.10.10.1\'', '0.0.0.0')
  .option('--port [number]', 'The port the server should listen on.', 8080)
  .option('-p, --production', 'Passes the -p flag to the webpack config')
  .parse(process.argv);

serve({
  config: loadWebpackConfig(commander.config),
  host: commander.host,
  port: Number(commander.port),
  production: commander.production,
});
