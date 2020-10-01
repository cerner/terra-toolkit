// eslint-disable-next-line import/no-extraneous-dependencies
const commander = require('commander');
const Serve = require('../packages/terra-functional-testing/lib/express-server/index.js');

const packageJson = require('../package.json');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--port [number]', 'The port the app should listen on. Default: 8080', undefined)
  .option('--host [string]', 'Sets the host that the server will listen on. Default:\'0.0.0.0\'', undefined)
  .option('--site <path>', 'The relative path to the static site. Default: \'./build\'', undefined)
  .parse(process.argv);

const server = new Serve({
  host: commander.host,
  port: commander.port,
  site: commander.site,
});

server.createApp();
server.start();
