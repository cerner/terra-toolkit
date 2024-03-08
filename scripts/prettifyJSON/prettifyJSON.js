/* eslint-disable array-callback-return  */
/* eslint-disable consistent-return */
/* eslint-disable no-console  */
/* eslint-disable no-param-reassign  */
/* eslint-disable no-restricted-syntax  */

module.exports = (oldJSON) => {
//  const oldJSON = JSON.parse(fs.readFileSync(JSONfile));
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

  if (oldJSON.author) {
    newJSON.author = oldJSON.author;
    delete oldJSON.author;
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

  if (oldJSON.private) {
    newJSON.private = oldJSON.private;
    delete oldJSON.private;
  }

  if (oldJSON.publishConfig) {
    newJSON.publishConfig = oldJSON.publishConfig;
    delete oldJSON.publishConfig;
  }

  if (oldJSON.workspaces) {
    newJSON.workspaces = oldJSON.workspaces;
    // alphabetize the list
    newJSON.workspaces.sort(Intl.Collator().compare);
    delete oldJSON.workspaces;
  }

  if (oldJSON.engines) {
    newJSON.engines = oldJSON.engines;
    delete oldJSON.engines;
  }

  if (oldJSON.main) {
    newJSON.main = oldJSON.main;
    delete oldJSON.main;
  }

  if (oldJSON.files) {
    newJSON.files = oldJSON.files;
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
  if (Object.keys(oldJSON).length) {
    const orderedKeys = Object.keys(oldJSON).sort().reduce((obj, key) => {
      obj[key] = oldJSON[key];
      return obj;
    }, {});

    newJSON = { ...newJSON, ...orderedKeys };
  }

  // Add dependencies & scripts at the end
  newJSON = { ...newJSON, ...tempJSON };

  return newJSON;
};

