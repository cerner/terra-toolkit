// export { default as LocalCompare } from './methods/LocalCompare';
// export { default as SaveScreenshot } from './methods/SaveScreenshot';
const LocalCompare = require('./methods/LocalCompare');
const SaveScreenshot = require('./methods/SaveScreenshot');

module.exports = {
  LocalCompare,
  SaveScreenshot,
};
