const { Builder, Capabilities } = require("selenium-webdriver");
const ie = require('selenium-webdriver/ie');
const { ie : ieOptions } = require('../../src/config/capabilities');

(async function reducedTestCase() {
  const driver = new Builder()
    .usingServer("http://10.188.194.84:4444/wd/hub")
    .withCapabilities(Capabilities.ie(ieOptions))
    .build();
  try {
    await driver.get('https://engineering.cerner.com/terra-application/tests/terra-application/application-base/private/test-overrides-test/');
    await driver.executeScript(() => testFn(1));
    await driver.executeScript(() => testFn(2));
    await driver.navigate().refresh();
    await driver.executeScript(() => testFn(3));
    await driver.executeScript(() => testFn(4));
  } finally {
    await driver.quit();
  }
})();

function testFn (number) {
  console.log(`[${number}]execute testFn`);
}
