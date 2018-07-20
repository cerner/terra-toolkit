const serve = require('./serve-static');
const loadWebpackConfig = require('../scripts/serve/loadWebpackConfig');

serve({
  config: loadWebpackConfig(),
  host: '0.0.0.0',
  port: process.env.PORT,
  production: true,
  site: 'build',
});
