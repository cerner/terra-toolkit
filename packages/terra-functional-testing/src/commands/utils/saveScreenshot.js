const fs = require('fs-extra');
const path = require('path');

const saveScreenshot = () => {
  const browserName = browser.capabilities.browserName;
  const screenshotPath = path.join(process.cwd(), 'verification', browserName || '', 'test.png');
  fs.ensureDirSync(screenshotPath);
  browser.saveScreenshot(screenshotPath);
};

module.exports = saveScreenshot;
