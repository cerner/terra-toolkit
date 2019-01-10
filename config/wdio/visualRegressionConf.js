const TerraCompare = require('../../lib/wdio/services/compare/TerraCompare').default;
const LocalScreenshotProcessor = require('../../lib/wdio/services/compare/LocalScreenshotProcessor').default;

module.exports = {
  compare: new TerraCompare(LocalScreenshotProcessor),
  viewportChangePause: 100,
};
