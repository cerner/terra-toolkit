const fs = require('fs-extra');
const callbackGlob = require('glob');
const util = require('util');
const path = require('path');
const ignore = require('ignore');

const IGNORE_FILE_PATH = path.join(process.cwd(), '.packagejsonlintignore');

const glob = util.promisify(callbackGlob);

const getIgnorer = async () => {
  const ignoreFileContents = await fs.readFile(IGNORE_FILE_PATH, 'utf8');
  return ignore().add(ignoreFileContents);
};

const getPathsForPackages = async () => {
  const paths = await glob(path.join(process.cwd(), '**', 'package.json'), { ignore: [path.join('**', 'node_modules', '**')] });
  const ignorer = await getIgnorer();
  return paths.filter(currentPath => !ignorer.ignores(path.relative(process.cwd(), currentPath)));
};

module.exports = {
  getPathsForPackages,
};
