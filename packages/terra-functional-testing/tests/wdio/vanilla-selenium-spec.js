const { Builder, Capabilities } = require("selenium-webdriver");
const ie = require('selenium-webdriver/ie');
const { ie : ieOptions } = require('../../src/config/capabilities');

function dispatchEvent(eventName, eventMetaData) {
  /* If IE support is removed, convert below to use event constructors. */
  const event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  event.metaData = eventMetaData;
  window.dispatchEvent(event);
}

(async function reducedTestCase() {
  const driver = new Builder()
    .usingServer("http://10.188.194.84:4444/wd/hub")
    .withCapabilities(Capabilities.ie(ieOptions))
    .build();
  try {
    await driver.get('https://engineering.cerner.com/terra-application/tests/terra-application/application-base/private/test-overrides-test/');
    // await driver.executeScript(function() { dispatchEvent('applicationBase.testOverride', { locale: 'es' }); });
    // await driver.executeScript(function() { dispatchEvent('applicationBase.testOverride', { locale: 'fr' }); });
    await driver.executeScript("window.open()");
    await driver.executeScript("console.log('test')");
    await driver.navigate().refresh();
    // await driver.executeScript(function() { dispatchEvent('applicationBase.testOverride', { locale: 'de' }); });
    // await driver.executeScript(function() { dispatchEvent('applicationBase.testOverride', { locale: 'pt' }); });
    await driver.executeScript("console.log('test')");
    await driver.executeScript("console.log('test')");
  } finally {
    await driver.quit();
  }
})();
