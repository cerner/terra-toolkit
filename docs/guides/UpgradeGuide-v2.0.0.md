# Terra Toolkit Upgrade Guide v2.0.0
1. Update Toolkit Dependency to `^2.9.0`
2. Install Docker `17.09.0` or higher - latest version recommended
3. Update nightwatch configuration to something like:

```js
// pull in the default nightwatch configuration setup function
const nightwatchConfig = require('terra-toolkit/lib/nightwatch/nightwatch.config.js').default;
// reference your webpack configuration
const webpackConfig = require('./packages/terra-clinical-site/webpack.config');

// Create a list of the src folders
const srcFolders = 'tests/nightwatch/';

// OR if a mono-repo,  use the following nightwatch helper:
const getPackageTestDirectories = require('terra-toolkit/lib/nightwatch/setup-helper.js').getPackageTestDirectories;

let srcFolders;
const isRepoTest = !process.cwd().includes('/packages/');
if (isRepoTest) {
 srcFolders = getPackageTestDirectories('lerna.json');
} else {
 srcFolders = 'tests/nightwatch/';
}

// create the configuration
const config = nightwatchConfig(webpackConfig, srcFolders);

// create the configuration with a specified port number
const config = nightwatchConfig(webpackConfig, srcFolders, 8081);

// export the config
module.exports = config;
```

4. Update nightwatch tests

Change Overview:
- Screenshot utility was removed. To maintain, manual commands to nightwatch must be added.
- Resize helper was added to wrap the test suite to run each test step before resizing the browser
- Update all url paths from `http://localhost:${browser.globals.webpackDevServerPort}/#` to `${browser.launchUrl}/#`

```diff
 // eslint-disable-next-line import/no-extraneous-dependencies
-const screenshot = require('terra-toolkit').screenshot;
-
-module.exports = {
-  before: (browser, done) => {
-    browser.resizeWindow(browser.globals.width, browser.globals.height, done);
-  },
-
-  afterEach: (browser, done) => {
-    screenshot(browser, 'terra-clinical-application', done);
-  },
+const resizeTo = require('terra-toolkit/lib/nightwatch/responsive-helpers').resizeTo;
 
+module.exports = resizeTo(['tiny', 'small', 'medium', 'large', 'huge', 'enormous'], {
   'Renders the Application with provided AppDelegate': (browser) => {
     browser
-      .url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/application-tests/default`)
+      .url(`${browser.launchUrl}/#/tests/application-tests/default`)
       .assert.elementPresent('#Application')
       .assert.containsText('.test-ContainerComponent', 'App is present');
   },
 
   'Renders the Application without provided AppDelegate': (browser) => {
     browser
-      .url(`http://localhost:${browser.globals.webpackDevServerPort}/#/tests/application-tests/no-app-delegate`)
+      .url(`${browser.launchUrl}/#/tests/application-tests/no-app-delegate`)
       .assert.elementPresent('#Application')
       .assert.containsText('.test-ContainerComponent', 'App is not present');
   },
-};
+});
```
5. Update nightwatch test script to be like:
```js
"test:nightwatch": "nightwatch",
```

**Note:** Terra no longer supports nightwatch testing and has moved to migrate tests to the webdriver.io testing framework. Why did we switch? 

1) Nightwatch/phantomJS is not longer maintained with the release of headless chrome. 
2) Webdriver.io is highly configurable, extendable and supports tdd and bdd. Through the use of services, webdriver.io gives us the ability to write bdd tests using mocha-chai syntax, perform accessibility testing and visual-regression testing.
 