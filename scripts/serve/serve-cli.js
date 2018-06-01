const commander = require('commander');
const serve = require('./serve');

const packageJson = require('../../package.json');
const loadWebpackConfig = require('./loadWebpackConfig');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--config <path>', 'The webpack config to serve.', undefined)
  .option('--port <n>', 'The port the server should listen on.', parseInt)
  .option('-p, --production', 'Passes the -p flag to the webpack config')
  .parse(process.argv);

const port = commander.port || process.env.PORT;

serve({
  config: loadWebpackConfig(commander.config),
  port,
  production: commander.production,
});
