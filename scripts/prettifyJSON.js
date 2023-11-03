// This script can be used to format json files.
// To execute the script, run: node prettifyJSON.js <path to folder>

/* eslint-disable consistent-return */
/* eslint-disable array-callback-return  */
/* eslint-disable no-restricted-syntax  */
/* eslint-disable no-console  */

const fs = require('fs');
const path = require('path');

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

// Update JSON files

allPackageJSON.map((JSONfile)=>{
    const oldJSON = JSON.parse(fs.readFileSync(JSONfile));
    let newJSON = {};

    if (oldJSON.name) {
      newJSON.name = oldJSON.name;
      delete oldJSON.name;
    }

  if (oldJSON.version) {
    newJSON.version = oldJSON.version;
    delete oldJSON.version;
  }

  if (oldJSON.description) {
    newJSON.description = oldJSON.description;
    delete oldJSON.description;
  }

  if (oldJSON.engines) {
    newJSON.engines = oldJSON.engines;
    delete oldJSON.engines;
  }

  if (oldJSON.author) {
    newJSON.author = oldJSON.author;
    delete oldJSON.author;
  }

  if (oldJSON.main) {
    newJSON.main = oldJSON.main;
    delete oldJSON.main;
  }

  if (oldJSON.repository) {
    newJSON.repository = oldJSON.repository;
    delete oldJSON.repository;
  }

  if (oldJSON.bugs) {
    newJSON.bugs = oldJSON.bugs;
    delete oldJSON.bugs;
  }

  if (oldJSON.homepage) {
    newJSON.homepage = oldJSON.homepage;
    delete oldJSON.homepage;
  }

  if (oldJSON.private) {
    newJSON.private = oldJSON.private;
    delete oldJSON.private;
  }

  if (oldJSON.publishConfig) {
    newJSON.publishConfig = oldJSON.publishConfig;
    delete oldJSON.publishConfig;
  }

  if (oldJSON.license) {
    newJSON.license = oldJSON.license;
    delete oldJSON.license;
  }

  if (oldJSON.keywords) {
    newJSON.keywords = oldJSON.keywords;
    // alphabetize the list
    newJSON.keywords.sort(Intl.Collator().compare);
    delete oldJSON.keywords;
  }

  if (oldJSON.workspaces) {
    newJSON.workspaces = oldJSON.workspaces;
    // alphabetize the list
    newJSON.workspaces.sort(Intl.Collator().compare);
    delete oldJSON.workspaces;
  }

  if (oldJSON.files) {
    newJSON.files = oldJSON.files;
    // alphabetize the list
    newJSON.files.sort(Intl.Collator().compare);
    delete oldJSON.files;
  }

  if (oldJSON.bin) {
    newJSON.bin = oldJSON.bin;
    delete oldJSON.bin;
  }

  if (oldJSON.browserslist) {
    newJSON.browserslist = oldJSON.browserslist;
    delete oldJSON.browserslist;
  }

  if (oldJSON.eslintConfig) {
    newJSON.eslintConfig = oldJSON.eslintConfig;
    delete oldJSON.eslintConfig;
  }

  if (oldJSON['package-json-lint']) {
    newJSON['package-json-lint'] = oldJSON['package-json-lint'];
    delete oldJSON['package-json-lint'];
  }

  if (oldJSON.stylelint) {
    newJSON.stylelint = oldJSON.stylelint;
    delete oldJSON.stylelint;
  }

  const tempJSON = {};

  if (oldJSON.dependencies) {
    tempJSON.dependencies = oldJSON.dependencies;
    delete oldJSON.dependencies;
  }

  if (oldJSON.peerDependencies) {
    tempJSON.peerDependencies = oldJSON.peerDependencies;
    delete oldJSON.peerDependencies;
  }

  if (oldJSON.devDependencies) {
    tempJSON.devDependencies = oldJSON.devDependencies;
    delete oldJSON.devDependencies;
  }

  if (oldJSON.scripts) {
    tempJSON.scripts = oldJSON.scripts;
    delete oldJSON.scripts;
  }

  // Remaining tags are added at the end
  if (Object.keys(oldJSON).length > 0) {
    newJSON = {...newJSON, ...oldJSON};
  }

  // Add dependencies & scripts at the end
  newJSON = {...newJSON, ...tempJSON};

  fs.writeFileSync(JSONfile, JSON.stringify(newJSON, null, 2));
  fs.appendFileSync(JSONfile, '\n');
  });

process.exit(0);
