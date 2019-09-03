const fs = require('fs');
const Logger = require('../utils/logger');

fs.readFile(`${process.env.INIT_CWD}/package.json`, (error, file) => {
  if (error) {
    throw Logger.error(error);
  }

  const { dependencies } = JSON.parse(file);

  if (dependencies['terra-toolkit']) {
    Logger.warn('+-------------------------------------------------------------------------------------------------------------+');
    Logger.warn('|                                                   WARNING                                                   |');
    Logger.warn('+-------------------------------------------------------------------------------------------------------------+');
    Logger.warn('|                             terra-toolkit must be installed as a devDependency.                             |');
    Logger.warn('|                                                                                                             |');
    Logger.warn('| Modify the package.json to remove terra-toolkit from dependencies and add terra-toolkit to devDependencies. |');
    Logger.warn('+-------------------------------------------------------------------------------------------------------------+');
  }
});
