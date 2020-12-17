const lodashTemplate = require('lodash.template');
const { getOptions } = require('loader-utils');

/**
  * Generate the entry point for the particular site plugin.
  * Don't use an arrow function or you wont have access to this.
  * @param {string} template contents of the file that triggered the loader.
  */
const loader = async function loader(template) {
  const callback = this.async();

  const {
    entryPath,
  } = getOptions(this);

  return callback(null, lodashTemplate(template)({
    entryPath,
  }));
};

module.exports = loader;
