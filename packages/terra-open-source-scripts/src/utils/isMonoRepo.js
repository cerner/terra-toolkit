const fs = require('fs-extra');
const path = require('path');

const isMonoRepo = async () => fs.pathExists(path.join(process.cwd(), 'lerna.json'));

module.exports = isMonoRepo;
