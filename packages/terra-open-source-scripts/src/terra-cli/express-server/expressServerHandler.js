const ExpressServer = require('./ExpressServer');

module.exports = async (options) => {
  const server = new ExpressServer({
    host: options.host,
    port: options.port,
    site: options.site,
  });

  await server.createApp();
  await server.start();
};
