const lockfile = require('lockfile');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs-extra');

const lock = promisify(lockfile.lock);
const unlock = promisify(lockfile.unlock);

const CONFIGURATION_PATH = path.join(__dirname, '..', '..', 'configuration.json');

module.exports = async (options) => {
  await lock(path.join(__dirname, 'tmp.lock'));
  const commands = await fs.pathExists(CONFIGURATION_PATH) ? await fs.readJSON(CONFIGURATION_PATH) : [];
  await fs.writeJSON(CONFIGURATION_PATH, Array.from(new Set([...commands, ...options.commands.map((command) => path.join(process.cwd(), command))])));
  await unlock(path.join(__dirname, 'tmp.lock'));
};
