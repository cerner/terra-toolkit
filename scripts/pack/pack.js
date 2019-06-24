const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Logger = require('../utils/logger');

const packageName = path.basename(process.cwd());
const archiveName = `${packageName}.tgz`;

// Remove the previous archive file if one exists.
if (fs.existsSync(archiveName)) {
  try {
    fs.unlinkSync(archiveName);
  } catch (err) {
    Logger.error(err);
  }
}

const child = spawnSync('npm', ['pack', '--ignore-scripts'], { encoding: 'utf8' });

if (child.error) {
  Logger.error(child.error);
}
// By default npm pack will append the package version to the tar archive file name.
// Rename the tar achieve file to exclude the appended version.
fs.renameSync(child.stdout.trim(), archiveName, (err) => {
  if (err) {
    Logger.error(err);
  }
});
