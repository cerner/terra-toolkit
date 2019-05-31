const commander = require('commander');
const serve = require('./serve-static');

const packageJson = require('../../package.json');

// Parse process arguments
commander
  .version(packageJson.version)
  .option('--port [number]', 'The port the app should listen on. Default: 8080', undefined)
  .option('--host [string]', 'Sets the host that the server will listen on. Default:\'0.0.0.0\'', undefined)
  .option('--site <path>', 'The relative path to the static site. Default: \'./build\'', undefined)
  .parse(process.argv);

serve({
  host: commander.host,
  port: commander.port,
  site: commander.site,
});
