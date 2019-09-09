const fs = require('fs');
const Logger = require('../utils/logger');

// INIT_CWD returns the initial working directory of the npm install. This ensures the package.json
// is being read from the root project installing terra-toolkit.
// See the following issue for more information: https://github.com/npm/npm/issues/16990
fs.readFile(`${process.env.INIT_CWD}/package.json`, (error, file) => {
  if (error) {
    console.log(`DEBUG: INIT_CWD: ${process.env.INIT_CWD}`);
    console.log(`DEBUG: process.cwd: ${process.cwd()}`);
    console.log(`DEBUG: process.env: ${JSON.stringify(process.env)}`);
    throw Logger.error(error);
  }

  const { dependencies } = JSON.parse(file);

  if (dependencies && dependencies['terra-toolkit']) {
    Logger.warn('+-------------------------------------------------------------------------------------------------------------+');
    Logger.warn('|                                                   WARNING                                                   |');
    Logger.warn('+-------------------------------------------------------------------------------------------------------------+');
    Logger.warn('|                             terra-toolkit must be installed as a devDependency.                             |');
    Logger.warn('|                                                                                                             |');
    Logger.warn('| Modify the package.json to remove terra-toolkit from dependencies and add terra-toolkit to devDependencies. |');
    Logger.warn('+-------------------------------------------------------------------------------------------------------------+');
  }
});
