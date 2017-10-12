const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');


module.exports = function (browser, done) {
  const testDirectory = path.dirname(module.parent.filename);
  const currentTest = browser.currentTest;

  browser.execute('document.documentElement.getAttribute("lang")', [], (locale) => {
    const snapshotDirectory = path.join(testDirectory, '__snapshots__', locale.value || 'en');

    browser.screenshot(false, (data) => {
      Jimp.read(Buffer.from(data.value, 'base64')).then((snapshot) => {
        const name = currentTest.name.replace(/\s+/g, '-');
        const browserName = browser.capabilities.browserName;
        const moduleName = currentTest.module.split('/').slice(-1)[0];
        const fileName = `${moduleName}_${name}_${browserName}${snapshot.bitmap.width}.jpg`;
        const filePath = path.join(snapshotDirectory, fileName);

        // Found a baseline
        if (fs.existsSync(filePath)) {
          Jimp.read(filePath).then((baseline) => {
            const diff = Jimp.diff(snapshot.autocrop(), baseline);
            browser.assert.equal(diff.percent, 0, `Baseline is ${diff.percent}% different`);
            done();
          });
        // New Image
        } else {
          snapshot.autocrop().write(filePath, () => {
            done();
          });
        }
      });
    });
  });
};
