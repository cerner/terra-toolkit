#!/usr/bin/env node

const serve = require('../scripts/serve/serve-static');
const loadWebpackConfig = require('../scripts/serve/loadWebpackConfig');

serve({
  config: loadWebpackConfig(),
  host: '0.0.0.0',
  // This environment variable is necessary for heroku deployments
  port: process.env.PORT,
  production: true,
  site: 'build',
});
