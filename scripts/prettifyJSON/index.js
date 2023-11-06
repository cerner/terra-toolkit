// This script can be used to format json files.
// To execute the script, run: node prettifyJSON.js <path to folder>

/* eslint-disable consistent-return */
/* eslint-disable array-callback-return  */
/* eslint-disable no-restricted-syntax  */
/* eslint-disable no-console  */

const fs = require('fs');
const path = require('path');
const prettifyJSON = require('./prettifyJSON');

if (process.argv.length === 2) {
  console.error('Expected at least one argument!');
  process.exit(1);
}
const targetDir = process.argv[2] || 'Default';

// get all JSON files

const allPackageJSON = [];

const getAllPackageJSONRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getAllPackageJSONRecursively(absolute);
    } else if (absolute.includes('package.json') && !absolute.includes('node_modules')) allPackageJSON.push(absolute);
  }
};

getAllPackageJSONRecursively(targetDir);

allPackageJSON.map((JSONfile) => {
  const oldJSON = JSON.parse(fs.readFileSync(JSONfile));
  const newJSON = prettifyJSON(oldJSON);
  fs.writeFileSync(JSONfile, JSON.stringify(newJSON, null, 2));
  fs.appendFileSync(JSONfile, '\n');
});

process.exit(0);
