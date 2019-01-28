const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { consoleLog } = require('../../lib/logger');

const packageName = path.basename(process.cwd());
const archiveName = `${packageName}.tgz`;

// Remove the previous archive file if one exists.
if (fs.existsSync(archiveName)) {
  shell.rm(archiveName);
}

// Pack the package.
shell.exec('npm pack --ignore-scripts', { silent: true }, (code, stdout, stderr) => {
  if (code !== 0) {
    consoleLog(stderr);
    shell.exit(-1);
  }

  // By default npm pack will append the package version to the tar archive file name.
  // Rename the tar achive file to exclude the appended version.
  shell.mv(stdout, archiveName);
  shell.exit(0);
});
