const fs = require('fs');
const Logger = require('../utils/logger');

/**
 * Validates the installation of terra-toolkit.
 * Logs a warning if terra-toolkit is detected as a hard dependency.
 * terra-toolkit is expected to always be installed as a devDependency.
 */
function validateInstall() {
  /**
   * INIT_CWD returns the initial working directory of the npm install.
   * See the following issue for more information: https://github.com/npm/npm/issues/16990
   * Note: This feature was introduced in npm 5.4.0.
   */
  if (!process.env.INIT_CWD) {
    Logger.warn('WARNING: [terra-toolkit] - INIT_CWD was undefined. This is likely due to an outdated version of npm. Please consider upgrading.');
    return;
  }

  fs.readFile(`${process.env.INIT_CWD}/package.json`, (error, file) => {
    if (error) {
      Logger.warn('WARNING: [terra-toolkit] - Unable to validate if terra-toolkit was installed as a dev-dependency. Please ensure terra-toolkit is defined as a devDependency and not a dependency in the package.json.');
      return;
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
}

validateInstall();
