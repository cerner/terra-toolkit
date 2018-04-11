/* eslint-disable no-console */
const express = require('express');
const path = require('path');


const serve = (options) => {
  const app = express();
  const port = process.env.PORT || 8081;
  // path to webpack built path
  const buildPath = path.join(process.cwd(), 'build');

  app.use('/static', express.static(buildPath));
  app.get('/', (req, res) => res.redirect('/static'));
  app.listen(port);
  console.log(`Listening ${port}`);
  console.log(`Production Environment: ${process.env.NODE_ENV === 'production'}`);
};

module.exports = serve;
