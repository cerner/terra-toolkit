const commander = require('commander');
const serve = require('./serve');

const packageJson = require('../../package.json');
const loadWebpackConfig = require('./loadWebpackConfig');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve.', undefined)
  .option('--host <s>', 'Sets the host that the server will listen on. eg. \'10.10.10.1\'', '0.0.0.0')
  .option('--port <n>', 'The port the server should listen on.', parseInt)
  .option('-p, --production', 'Passes the -p flag to the webpack config')
  .parse(process.argv);

serve({
  config: loadWebpackConfig(commander.config),
  host: commander.host,
  port: commander.port,
  production: commander.production,
});
