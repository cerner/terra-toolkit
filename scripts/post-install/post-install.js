const fs = require('fs');
const Logger = require('../utils/logger');

fs.readFile(`${process.cwd()}/package.json`, (error, file) => {
  if (error) {
    Logger.error(error);
  }
  console.log(JSON.parse(file));
});