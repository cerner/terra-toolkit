const { Builder, Capabilities } = require("selenium-webdriver");

function dispatchEvent(eventName, eventMetaData) {
  /* If IE support is removed, convert below to use event constructors. */
  const event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  event.metaData = eventMetaData;
  window.dispatchEvent(event);
}

(async function reducedTestCase() {
  const driver = new Builder()
    .usingServer("http://10.188.198.242:4444/wd/hub")
    .withCapabilities(Capabilities.ie())
    .build();
  try {
    await driver.get('https://engineering.cerner.com/terra-application/tests/terra-application/application-base/private/test-overrides-test/');
    await driver.executeScript(function(name, metaData) {
      const event = document.createEvent('Event');
      event.initEvent(name, true, true);
      event.metaData = metaData;
      window.dispatchEvent(event);
    }, 'applicationBase.testOverride', { locale: 'en-US' });
    await driver.executeScript(function(name, metaData) {
      const event = document.createEvent('Event');
      event.initEvent(name, true, true);
      event.metaData = metaData;
      window.dispatchEvent(event);
    }, 'applicationBase.testOverride', { locale: 'de' });
    await driver.navigate().refresh();
    await driver.executeScript(function(name, metaData) {
      const event = document.createEvent('Event');
      event.initEvent(name, true, true);
      event.metaData = metaData;
      window.dispatchEvent(event);
    }, 'applicationBase.testOverride', { locale: 'fr' });
    await driver.takeScreenshot();
    // await driver.executeScript(function(event) {
    //   dispatchEvent(event.name, event.metaData);
    // }, { name: 'applicationBase.testOverride', metaData: { locale: 'pt' }});
    // await driver.executeScript(function() { console.log('test'); });
  } catch(err) {
    throw new Error(`error: ${err}`);
  } finally {
    await driver.quit();
  }
})();
