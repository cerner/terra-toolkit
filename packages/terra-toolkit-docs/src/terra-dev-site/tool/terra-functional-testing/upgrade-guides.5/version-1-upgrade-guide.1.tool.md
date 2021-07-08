# Terra Functional Testing - Version 1 Upgrade Guide

We're excited to announce the release of @cerner/terra-functional-testing which will be replacing the automation testing responsibilities of terra-toolkit. We've made some changes and gave our testing infrastructure a much needed upgrade. This document will outline the major changes and provide useful tips for upgrading from `terra-toolkit` to `@cerner/terra-functional-testing` v1.

## Introduction

Since terra-toolkit was originally released in 2017 many new features have been added to create an all-in-one development toolkit. These new features introduced responsibilities for the development site, webpack, jest, reporting, and automation testing. Bundling all these responsibilities into single package has made it difficult to introduce new changes. With the upgrade to WebDriverIO v6 we decided to use this as an opportunity for restructuring our development tools.

## New Package Structure

The [terra-toolkit](https://github.com/cerner/terra-toolkit) repository has been converted into a [lerna monorepo](https://github.com/lerna/lerna) that contains independent packages for each of our development tools. The [terra-toolkit development package](https://www.npmjs.com/package/terra-toolkit) has been moved into the [terra-toolkit-boneyard](https://github.com/cerner/terra-toolkit-boneyard) repository and will receive minor updates and bug fixes as teams begin the transition to terra-functional-testing.

Moving forward, development responsibilities have been separated out into individual packages that encapsulate specific functionality. As we transition packages into the terra-toolkit monorepo each package will be scoped under the [@cerner](https://www.npmjs.com/org/cerner) NPM organization. For example, automation testing has been moved into @cerner/terra-functional-testing and webpack concerns have been moved into [@cerner/webpack-config-terra](/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/about).

## Breaking Changes

There are quite a few breaking changes with this upgrade. Most notably are the breaking changes from WebDriverIO v4 to v6. We're jumping two major versions as part of this upgrade to get our testing infrastructure a much needed upgrade. Many of the browser command APIs have changed to align more consistently. As part of this upgrade teams should expect to update many of their tests. We'll outline a few examples throughout this guide.

### WebDriverIO v4 to v6

The most notable breaking changes are the breaking changes from WebDriverIO v4 to WebDriverIO v6. We'll outline a few of the most common API changes we encountered ourselves as we uplifted our own repositories. A complete list of the breaking changes can be found here:

- [WebDriverIO v5 Breaking Changes](https://github.com/webdriverio/webdriverio/blob/v5.0.0/CHANGELOG.md#boom-breaking-change)
- [WebDriverIO v6 Breaking Changes](https://github.com/webdriverio/webdriverio/blob/d1f3da652f287d297bd6b13f49194d58599dacd0/CHANGELOG.md#boom-breaking-change)

Commands used during testing have been updated to create a clear distinction between commands acting on the browser/client and commands acting on an element.

For example, in WebDriverIO v4 a click interaction could be called on the browser by passing it a selector, but in v5 and above the action is called on the element instance. When upgrading each of these commands must be updated to the new syntax.

```diff
- browser.click('#element'); // Old v4 click. This has been removed.
+ $('#element').click(); // New v6 click. The action is called on the element instance.
```

Here are a few of the most common scenarios we encountered:

```diff
// Clicks
- browser.click('#element');
+ $('#element').click();

// Set Value
- browser.setValue('input', 'value');
+ $('input').setValue('value');

// Add Value
- browser.addValue('input', 'value');
+ $('input').addValue('value');

// Wait For Visible
- browser.waitForVisible('#element');
+ $('#element').waitForDisplayed();

// Move To
- browser.moveToObject('#element', 0, 10);
+ $('#element').moveTo({ xOffset: 0, yOffset: 10 });
```

### Dropping Support For Node 8

We're dropping support for node 8 as part of the transition to terra-functional-testing. Node 8 reached [end of life status](https://github.com/nodejs/Release/blob/master/README.md#end-of-life-releases) December 31st, 2019. Teams still on node 8 will need to upgrade to node 10.

We plan to start upgrading our node version on a more routine cadence following this transition. Our range of node version support is restricted by our transitive dependency on [fibers](https://github.com/laverdet/node-fibers) which is necessary for running our WebDriverIO testing environment [synchronously](https://v6.webdriver.io/docs/sync-vs-async.html).

### Assertion Framework

We've removed the [chai assertion framework](https://www.chaijs.com/) and opted into using the built in [assertion library](https://v6.webdriver.io/docs/assertion.html) that ships with WebDriverIO. This new assertion framework closely resembles the testing environment most of us are used to in Jest, because it is [Jest's expect library](https://jestjs.io/docs/en/expect). This should help align testing between Jest and WebDriverIO.

A few common changes look something like this:

```diff
- expect(true).to.be.true; // Chai assertion
+ expect(true).toBe(true); // Expect/Jest assertion.

- expect(true).to.be.false; // Chai assertion
+ expect(true).toBe(false); // Expect/Jest assertion.

- expect(1).to.equal(1); // Chai assertion
+ expect(1).toEqual(1); // Expect/Jest assertion.
```

WebDriverIO provides a collection of [matchers](https://v6.webdriver.io/docs/api/expect.html) that can be used for assertions in your tests.

### Terra Commands

The `Terra.it` commands have been removed. We noticed they encouraged anti-patterns while writing tests and made testing more confusing.

These commands have been removed:

- Terra.it.validatesElement
- Terra.it.isAccessible
- Terra.it.matchesScreenshot

These commands can still be used but have had some changes:

- Terra.validates.accessibility
- Terra.validates.element
- Terra.validates.screenshot

The validates screenshot and validates element commands now require a screenshot name.

```js
it('should click and validate the element', () => {
  $('#element').click();

  Terra.validates.element('screenshot name'); //  A unique screenshot name must be provided or the command will throw an error.
});
```

The `viewports` option has been removed from `Terra.validates.screenshot`. The viewport option array created additional viewport permutations within other viewport permutations. To more consistently align viewport testing the option was removed. To specify an array of viewports use the `Terra.describeViewports` helper.

```diff
+ Terra.describeViewports('Terra.validates', ['tiny', 'small'], () => {
   it('should click and validate the element', () => {
     $('#element').click();

-     Terra.validates.screenshot('screenshot name', { viewports: ['tiny', 'small'] });
+     Terra.validates.screenshot('screenshot name');
   });
+ });
```

### Screenshots

We've forked and taken ownership of the visual regression service to give us better control of making changes when necessary. Over time we'll be working to resolve common errors encountered with the visual regression service. Such as the notorious x,y range error.

For now though, there are a few breaking changes to the screenshot strategy that will require regenerating screenshots.

- Screenshot names are no longer auto-generated using the describe blocks.
- Screenshots now require a unique name be provided. No screenshots within the same spec file should be identical. Screenshots in other spec files are not affected.
- Screenshots will be scoped under a theme when written to file under \__snapshots__.

We've removed the string concatenation of describe blocks to form a screenshot filename. Previously, the following example would generate a screenshot name of `block_1_block_2_screenshot_name`.

```js
describe('block 1', () => {
  describe('block 2', () => {
    it('should generate a screenshot', () => {
      Terra.validates.element('screenshot name'); // Previously screen generated as block_1_block_2_screenshot_name.
    });
  });
});
```

This was causing/forcing teams to modify their test structure to produce a meaningful screenshot name. A screenshot could be generated with a tremendously long filename and required sanitizing each of the block descriptions to remove special characters. Describe blocks should be used to describe and group tests together. They should not be introducing side effects to the generated screenshot name.

Moving forward, a unique name must be provided for the screenshot. This should help shorten screenshot names, provide a meaningful name, and encourage developers to write tests semantically.

```js
describe('block 1', () => {
  describe('block 2', () => {
    it('should generate a screenshot', () => {
      Terra.validates.element('unique screenshot name'); // This will now generate a screenshot named unique_screenshot_name.
    });
  });
});
```

As theming has become more prevalent in our ecosystem screenshots are now always written into a theme directory in \__snapshots__. If your application does not explicitly use a theme the screenshots will output under the default `terra-default-theme` directory. This change will require regenerating screenshots to move them into the appropriate theme directory.

```
├── __snapshots__
│   ├── reference
│   │   ├── clinical-lowlight-theme
│   │   │   └── en
│   │   │       └── chrome_huge
│   │   │           └── example-spec
│   │   │               ├── screenshot-1.png
│   │   │               └── screenshot-2.png
│   │   ├── orion-fusion-theme
│   │   │   └── en
│   │   │       └── chrome_huge
│   │   │           └── example-spec
│   │   │               ├── screenshot-1.png
│   │   │               └── screenshot-2.png
│   │   └── terra-default-theme
│   │       └── en
│   │           └── chrome_huge
│   │               └── example-spec
│   │                   ├── screenshot-1.png
│   │                   └── screenshot-2.png
```

### Timezone

The `American/Chicago` timezone has been removed from the docker images. The timezone will default to the timezone provided by the docker image. This will align the selenium grid and local docker images to the same timezone.

### Accessibility Testing

The dependency on [axe-core](https://github.com/dequelabs/axe-core) has been upgraded from v3.5.3 to v4.0.2. There were no new rules introduced, but previous rules had fixes added that might start detecting accessibility violations after the upgrade that were not previously being detected.

Check out the [release notes](https://github.com/dequelabs/axe-core/releases) for more detail information about the changes.

### Default Selector

The default selector has been changed from `[data-terra-dev-site-content] *:first-child` to `[data-terra-test-content] *:first-child`. This selector is used as the default content region for capturing screenshots. This change should not affect most teams. For teams that are affected a custom selector can be provided using [service options](/dev_tools/cerner-terra-toolkit-docs/terra-functional-testing/wdio-services/terra-service#selector).

### Accessing the `formFactor`, `locale`, or `theme` options

The `formFactor`, `locale`, and `theme` options that used to be available in the `browser.options` global object no longer reside in this object. These options along with other data are now available in the `Terra.serviceOptions` global object.

### Accessing the `browser` object

Any usage of the `browser` global object should be moved inside the `it` block because `browser` will be `undefined` when accessed outside the scope of the `it` block. This reason for this behavior is due to how the WebDriverIO testing lifecycle hooks are implemented in v6.

## New Features

### Accessibility Reporter

A custom WebDriverIO reporter has been created to facilitate monitoring accessibility violations and reporting them upon the completion of the test run. The goal of this reporter is to allow us to more frequently upgrade our version of axe-core without as many breaking changes. When axe adds new rules those rules can be marked as warnings and the accessibility reporter will report them to the terminal without failing as a violation. Please monitor your terminal output to stay proactive on accessibility warnings.

### Terra CLI

Our command line interface has been transitioned to [Terra CLI](/dev_tools/cerner-terra-toolkit-docs/terra-cli/about) to create a uniform experience across our scripts. All new commands are integrated plugins for the terra-cli. Command options are constructed using [yargs](https://github.com/yargs/yargs);

As part of this upgrade teams will be updating the scripts used to invoke wdio to use the terra-cli commands. The `terra wdio` script will invoke the test runner.

Note: The terra cli array parameters have a different syntax. [Array](https://github.com/yargs/yargs/blob/master/docs/api.md#array) items are now delimited by a space.

```diff
// package.json
{
  "scripts": {
-    "test:wdio": "wdio"
+    "test:wdio": "terra wdio"
-    "test:wdio:local": "tt-wdio --gridUrl='grid.test.example.com' --locales=['de','en-AU'] --browsers=['chrome','firefox','ie']"
+    "test:wdio:local": "terra wdio --gridUrl grid.test.example.com --locales de en-AU --browsers chrome firefox ie"
  }
}
```

### Auto Update Screenshots

A CLI option has been added to auto-update reference screenshots during the test run. When enabled all screenshots generated during the test run will automatically overwrite the existing reference screenshot. Be sure to manually validate screenshot updates when using this feature.

Via the Terra CLI:

```sh
terra wdio --updateScreenshots

# -u is a shortcut for the same command
terra wdio -u
```

### VPN Support

We've added support to automatically detect the VPN IP address. It is no longer necessary to manually specify the `WDIO_EXTERNAL_HOST` when running wdio. These changes were tested successfully on Mac OS Catalina. Results may vary when running on different platforms and operating systems. It's not perfect and we'll make tweaks as necessary. If this is not working for you let us know. Be sure to specify the operating system and platform you're developing on.

## How to Upgrade

There are a few prerequisites to get started. We'll be removing `terra-toolkit` as a dependency later in this guide. Removing `terra-toolkit` is going to impact starting the local development site and webpack configurations. The first step of this transition will be to upgrade to [@cerner/webpack-config-terra](/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/about).

### Upgrading Webpack

If you are already using @cerner/webpack-config-terra ^1.0.0 you can skip this section.

A complete upgrade guide can be found [here](/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/upgrade-guide). Webpack can be upgraded separately from terra-functional-testing. This change does not need to be bundled with test updates, but it does need to happen before the test updates.

Install @cerner/webpack-config-terra, @cerner/terra-aggregate-translations, and postcss ^8.2.1 (a required peer dependency of webpack-config-terra):

```sh
npm install --save-dev @cerner/webpack-config-terra @cerner/terra-aggregate-translations postcss@8.2.1
```

If your project utilizes the `tt-serve-static` bin command go ahead and install [terra-cli](/dev_tools/cerner-terra-toolkit-docs/terra-cli/about) as you'll need it to upgrade the static asset utilities:

```sh
npm install --save-dev @cerner/terra-cli
```

Update any references to the old webpack configuration:

```diff
// webpack.config.js
- const webpackConfig = require('terra-dev-site/config/webpack/webpack.config');
+ const webpackConfig = require('@cerner/webpack-config-terra');
```

Update any references to the old terra-aggregate-translations:


```diff
// jestGlobalSetup.js
- const aggregateTranslations = require('terra-aggregate-translations');
+ const aggregateTranslations = require('@cerner/terra-aggregate-translations');
```

Update any scripts in the package.json to use webpack-dev-server. Use terra-cli for any static sites. Remove any reference to `tt-clean-screenshots` since cleaning the `diff`, `latest`, and `error` screenshot directories is now executed automaticatically for each test run. Remove `terra-aggregate-translations` if installed:

```diff
// package.json
{
  "scripts": {
-    "clean:obsolete-wdio-snapshots": "tt-clean-screenshots",
-    "start": "tt-serve",
-    "start-prod": "tt-serve --env.disableHotReloading -p",
-    "start-static": "npm run pack && tt-serve-static",
+    "start": "webpack-dev-server",
+    "start-prod": "webpack-dev-server --env.disableHotReloading -p",
+    "start-static": "npm run pack && terra express-server --site ./build",
  },
  "devDependencies": {
+   "@cerner/terra-aggregate-translations": "^2.0.1",
+   "@cerner/terra-cli": "^1.3.0",
+   "@cerner/webpack-config-terra": "^1.2.0",
+   "postcss": "^8.2.1",
-   "terra-aggregate-translations": "^1.0.0"
  }
}
```

At this point it is recommended to do a clean install prior to testing each of the scripts. If you have the script go ahead and run `npm run clean:install`. Alternatively ensure that the old node_modules directory is deleted and reinstall all dependencies.

```sh
npm run clean:install
```

Verify each of the scripts are working as intended:

```sh
npm run start

npm run start-prod

npm run start-static
```

Note: If you don't have some of these commands it is not necessary to add them. Just ensure the commands you do have are working as expected. All of the `tt-serve` commands should be updated to use webpack-dev-server or the terra express server.

### Upgrading ESlint Config Terra

If you are already using @cerner/eslint-config-terra ^5.0.0 you can skip this section.

Upgrading `@cerner/eslint-config-terra` is optional, but recommended. WebDriverIO v6 syntax requires using the `$` global which has been [added](https://github.com/cerner/terra-toolkit/pull/548) to the eslint config. If you choose not to upgrade eslint-config-terra at this time you will need to add the global declaration manually in each spec file.

Adding the global manually to each spec file is only necessary if you are not upgrading to @cerner/eslint-config-terra ^5.0.0:

```js
/* global $ */
```

A complete upgrade guide can be found [here](https://github.com/cerner/terra-toolkit/blob/main/packages/eslint-config-terra/UpgradeGuide.md#eslint-config-terra-upgrade-guide).

Install @cerner/eslint-config-terra:

```sh
npm install --save-dev @cerner/eslint-config-terra
```

Remove the old `eslint-config-terra` and extend `@cerner/terra` from the `eslintConfig` key:

```diff
// package.json
{
  "eslintConfig": {
-   "extends": "terra",
+   "extends": "@cerner/terra",
  },
  "devDependencies": {
-    "eslint-config-terra": "^3.3.0",
+    "@cerner/eslint-config-terra": "^5.0.0",
+    "eslint": "^7.0.0" // Upgrade ESlint to v7.
  }
}
```

At this point it is recommended to do a clean install prior to running lint. If you have the script go ahead and run `npm run clean:install`. Alternatively ensure that the old node_modules directory is deleted and reinstall all dependencies.

```sh
npm run clean:install
```

Run eslint and resolve any of the new violations introduced by the new version of ESLint plugins transitively introduced.

```sh
npm run lint
```

### Installing Terra Functional Testing

After upgrading webpack and eslint your project is ready to start the migration to @cerner/terra-functional-testing. Before getting started make sure you're prepared to work through the entire uplift. We'll be removing the dependency on terra-toolkit. The implications are that the entire test suite needs to be uplifted. Our recommendation will be to split up the work and go through each spec file one by one. Enabling only the tests you are currently uplifting and disabling the others.

Install @cerner/terra-functional-testing and @cerner/terra-cli:

```sh
npm install --save-dev @cerner/terra-functional-testing @cerner/terra-cli
```

Remove terra-toolkit from the package.json:

```diff
// package.json
{
  "devDependencies": {
-   "terra-toolkit": "^6.0.0",
+   "@cerner/terra-cli": "^1.0.0",
+   "@cerner/terra-functional-testing": "^1.0.0"
  }
}
```

Update any references to the previous `wdio.conf.js`:

```diff
// wdio.conf.js
- const wdioConfig = require('terra-toolkit/config/wdio/wdio.conf');
+ const { config } = require('@cerner/terra-functional-testing');

- module.exports = wdioConfig;
+ exports.config = config;
```

Update scripts to use the Terra CLI:

Note: The terra cli array parameters have a different syntax.

```diff
// package.json
{
  "scripts": {
-    "test:wdio": "wdio"
+    "test:wdio": "terra wdio"
-    "test:wdio:local": "tt-wdio --gridUrl='grid.test.example.com' --locales=['de','en-AU'] --browsers=['chrome','firefox','ie']"
+    "test:wdio:local": "terra wdio --gridUrl grid.test.example.com --locales de en-AU --browsers chrome firefox ie"
  }
}
```

A list of the test runner CLI options can be found [here](/dev_tools/cerner-terra-toolkit-docs/terra-functional-testing/about#test-runner).

At this point it is recommended to do a clean install to remove stale installations of terra-toolkit. If you have the script go ahead and run `npm run clean:install`. Alternatively ensure that the old node_modules directory is deleted and reinstall all dependencies.

```sh
npm run clean:install
```

### Upgrading Tests

From here you are ready to start upgrading each of the spec files within your project. We recommend you uplifting each spec one by one by modifying the `wdio.config.js`. We used this strategy ourselves during our uplift and we think it helps.

Choose a spec file to uplift and limit the test run to only that file.

```js
// wdio.conf.js
const { config } = require('@cerner/terra-functional-testing');

config.specs = [
  '/tests/wdio/path/example-spec',
]

exports.config = config;
```

Here are some resources you'll want to bookmark as you work through each spec file.

- [WebDriverIO v4 API](http://v4.webdriver.io/api.html)
- [WebDriverIO v6 API](https://v6.webdriver.io/docs/api.html)

Work through the spec file and update the deprecated browser commands. Read through the [WebDriverIO breaking changes](#webdriverio-v4-to-v6) section above for more information.

Here are a few of the most common scenarios we encountered:

```diff
// Clicks
- browser.click('#element');
+ $('#element').click();

// Set Value
- browser.setValue('input', 'value');
+ $('input').setValue('value');

// Add Value
- browser.addValue('input', 'value');
+ $('input').addValue('value');

// Wait For Visible
- browser.waitForVisible('#element');
+ $('#element').waitForDisplayed();

// Move To
- browser.moveToObject('#element', 0, 10);
+ $('#element').moveTo({ xOffset: 0, yOffset: 10 });
```

Update any chai assertions to expect assertions. Read through the [assertion breaking changes](#assertion-framework) section above for more information.

A few common changes look something like this:

```diff
- expect(true).to.be.true; // Chai assertion
+ expect(true).toBe(true); // Expect/Jest assertion.

- expect(true).to.be.false; // Chai assertion
+ expect(true).toBe(false); // Expect/Jest assertion.

- expect(1).to.equal(1); // Chai assertion
+ expect(1).toEqual(1); // Expect/Jest assertion.
```

Ensure each `Terra.validates.element` and `Terra.validates.screenshot` is provided a unique name. Read through the [screenshots](#screenshots) section above for more information.

```js
it('should click and validate the element', () => {
  $('#element').click();

  Terra.validates.element('screenshot name'); //  A unique screenshot name must be provided or the command will throw an error.
});
```

Delete all screenshots associated to that spec file and initiate the test runner to regenerate screenshots. Resolve any errors that are thrown. Ensure every test generating a screenshot provides a unique screenshot name. Once the test run is successful move on to the next spec file and repeat the process.

The following example will throw a mismatch error because two screenshots are being generated with the same name.

```js
// example-spec.js

it('should click and validate the element', () => {
  $('#element-1').click();

  Terra.validates.element('screenshot name');
});

it('should click and validate the element', () => {
  $('#element-2').click();

  Terra.validates.element('screenshot name'); //  Will throw an error because a previous screenshot was generated with the same name.
});
```

## The Future - WebDriverIO v7 - Node 12

WebDriverIO v7 was released on [February 9th, 2021](https://webdriver.io/blog/2021/02/09/webdriverio-v7-released) and is on our radar. We'll be focusing on getting teams upgraded onto WebDriverIO v6 and node >= 10 as a stepping stone before releasing an upgrade to WebDriverIO v7. The changes from WebDriverIO v6 to v7 drop support for node 10 and appear to largely only impact typescript declarations. We'll investigate the breaking changes and work necessary for upgrading. We plan to release an upgrade in the near future pending the investigation and transition strategy for node >= 12.
