## Nightwatch to Webdriver.io Migration Guide
  
1. Check out the [Webdriver.io Utility Developer's Guide](https://github.com/cerner/terra-toolkit/blob/master/docs/Wdio_Utility.md) to learn how to add webdriver.io configuration and write tests.
2. Migrate nightwatch tests to webdriver tests like:
```diff
// The default Webdriver.io Framework is Mocha with ui set to BDD.
// The Terra Service provides global access to browser, Terra object, chai.should and chai.expect (See http://chaijs.com/api/bdd/)
+ /* global browser, before, Terra */

+ Terra.viewports().forEach((viewport) => {
+   describe('Component', () => {
+     before(() => browser.setViewportSize(viewport));
- module.exports = {
-  before: (browser, done) => {
-    browser.resizeWindow(browser.globals.width, browser.globals.height, done);
-  },

-  afterEach: (browser, done) => {
-    saveScreenshot(browser, 'End_Of_Test', done);
-  },

+     describe('Default Example', () => {
-  'Default Example': (browser) => {
    // Visit the URL
+       before(() =>  browser.url('/#/tests/component/default'););
-    browser
-      .url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/component/default`);

// At this point, checking that the elements are present is redundant when using visual regression since screenshot comparison will ensure these elements are displays
+    it('checks component exists', () => {
      // http://webdriver.io/api/state/isExisting.html
+      expect(browser.isExisting('.default')).to.be.true;
-      browser.expect.element('.default').to.be.present;
+    });

+    Terra.should.beAccessible();
+    Terra.should.matchScreenshot();
-    saveScreenshot(browser, 'default');
+ });
});
```