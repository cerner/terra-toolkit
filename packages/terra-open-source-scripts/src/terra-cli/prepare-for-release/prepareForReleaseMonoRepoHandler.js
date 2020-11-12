const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const stripAnsi = require('strip-ansi');
const Logger = require('@cerner/terra-cli/lib/utils/Logger');

const logger = new Logger({ prefix: '[terra-open-source-scripts:version]' });

const exec = promisify(childProcess.exec);

const updateChangelogForPackage = require('./updateChangelogForPackage');

const VERSION_OUTPUT_PATH = path.join(process.cwd(), 'tmp', 'version-output.txt');

module.exports = async () => {
  try {
    await fs.ensureFile(VERSION_OUTPUT_PATH);

    // Utilize inherit in terms of stdio so that we can interact with the user running the command to capture requested versions.
    // Exec doesn't allow using inherit and when you use inherit the output doesn't get returned. Thus, we use script
    // to capture the output to a file
    childProcess.execSync(`script -q ${VERSION_OUTPUT_PATH} lerna version --no-git-tag-version`, { stdio: 'inherit' });

    if (stripAnsi(await fs.readFile(VERSION_OUTPUT_PATH, 'utf-8')).includes('lerna success version finished')) {
      const { stdout } = await exec('npx lerna changed'); // Clean up lerna updated output and convert to an array
      const updatedPackages = stdout.split('\n').map(x => `packages/${x.replace('@cerner/', '')}`);
      updatedPackages.pop(); // Remove last item as it is an empty string

      // Update release version in changelog files
      await Promise.all(updatedPackages.map(packagePath => updateChangelogForPackage(packagePath)));
    } else {
      logger.warn('Lerna version aborted');
    }
  } finally {
    fs.remove(VERSION_OUTPUT_PATH);
  }
};
