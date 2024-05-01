"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[726],{44726:function(e,t,n){n.r(t),n.d(t,{default:function(){return d}});var r=n(58168),a=n(53986),o=(n(96540),n(36665)),i=["components"],s={},l="wrapper";function d(e){var t=e.components,n=(0,a.A)(e,i);return(0,o.mdx)(l,(0,r.A)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.mdx)("h1",{id:"terra-functional-testing---version-1-upgrade-guide"},"Terra Functional Testing - Version 1 Upgrade Guide"),(0,o.mdx)("p",null,"We're excited to announce the release of @cerner/terra-functional-testing which will be replacing the automation testing responsibilities of terra-toolkit. We've made some changes and gave our testing infrastructure a much needed upgrade. This document will outline the major changes and provide useful tips for upgrading from ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra-toolkit")," to ",(0,o.mdx)("inlineCode",{parentName:"p"},"@cerner/terra-functional-testing")," v1."),(0,o.mdx)("h2",{id:"introduction"},"Introduction"),(0,o.mdx)("p",null,"Since terra-toolkit was originally released in 2017 many new features have been added to create an all-in-one development toolkit. These new features introduced responsibilities for the development site, webpack, jest, reporting, and automation testing. Bundling all these responsibilities into single package has made it difficult to introduce new changes. With the upgrade to WebDriverIO v6 we decided to use this as an opportunity for restructuring our development tools."),(0,o.mdx)("h2",{id:"new-package-structure"},"New Package Structure"),(0,o.mdx)("p",null,"The ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-toolkit"},"terra-toolkit")," repository has been converted into a ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/lerna/lerna"},"lerna monorepo")," that contains independent packages for each of our development tools. The ",(0,o.mdx)("a",{parentName:"p",href:"https://www.npmjs.com/package/terra-toolkit"},"terra-toolkit development package")," has been moved into the ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-toolkit-boneyard"},"terra-toolkit-boneyard")," repository and will receive minor updates and bug fixes as teams begin the transition to terra-functional-testing."),(0,o.mdx)("p",null,"Moving forward, development responsibilities have been separated out into individual packages that encapsulate specific functionality. As we transition packages into the terra-toolkit monorepo each package will be scoped under the ",(0,o.mdx)("a",{parentName:"p",href:"https://www.npmjs.com/org/cerner"},"@cerner")," NPM organization. For example, automation testing has been moved into @cerner/terra-functional-testing and webpack concerns have been moved into ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/about"},"@cerner/webpack-config-terra"),"."),(0,o.mdx)("h2",{id:"breaking-changes"},"Breaking Changes"),(0,o.mdx)("p",null,"There are quite a few breaking changes with this upgrade. Most notably are the breaking changes from WebDriverIO v4 to v6. We're jumping two major versions as part of this upgrade to get our testing infrastructure a much needed upgrade. Many of the browser command APIs have changed to align more consistently. As part of this upgrade teams should expect to update many of their tests. We'll outline a few examples throughout this guide."),(0,o.mdx)("h3",{id:"webdriverio-v4-to-v6"},"WebDriverIO v4 to v6"),(0,o.mdx)("p",null,"The most notable breaking changes are the breaking changes from WebDriverIO v4 to WebDriverIO v6. We'll outline a few of the most common API changes we encountered ourselves as we uplifted our own repositories. A complete list of the breaking changes can be found here:"),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},(0,o.mdx)("a",{parentName:"li",href:"https://github.com/webdriverio/webdriverio/blob/v5.0.0/CHANGELOG.md#boom-breaking-change"},"WebDriverIO v5 Breaking Changes")),(0,o.mdx)("li",{parentName:"ul"},(0,o.mdx)("a",{parentName:"li",href:"https://github.com/webdriverio/webdriverio/blob/d1f3da652f287d297bd6b13f49194d58599dacd0/CHANGELOG.md#boom-breaking-change"},"WebDriverIO v6 Breaking Changes"))),(0,o.mdx)("p",null,"Commands used during testing have been updated to create a clear distinction between commands acting on the browser/client and commands acting on an element."),(0,o.mdx)("p",null,"For example, in WebDriverIO v4 a click interaction could be called on the browser by passing it a selector, but in v5 and above the action is called on the element instance. When upgrading each of these commands must be updated to the new syntax."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"- browser.click('#element'); // Old v4 click. This has been removed.\n+ $('#element').click(); // New v6 click. The action is called on the element instance.\n")),(0,o.mdx)("p",null,"Here are a few of the most common scenarios we encountered:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"// Clicks\n- browser.click('#element');\n+ $('#element').click();\n\n// Set Value\n- browser.setValue('input', 'value');\n+ $('input').setValue('value');\n\n// Add Value\n- browser.addValue('input', 'value');\n+ $('input').addValue('value');\n\n// Wait For Visible\n- browser.waitForVisible('#element');\n+ $('#element').waitForDisplayed();\n\n// Move To\n- browser.moveToObject('#element', 0, 10);\n+ $('#element').moveTo({ xOffset: 0, yOffset: 10 });\n")),(0,o.mdx)("h3",{id:"dropping-support-for-node-8"},"Dropping Support For Node 8"),(0,o.mdx)("p",null,"We're dropping support for node 8 as part of the transition to terra-functional-testing. Node 8 reached ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/nodejs/Release/blob/master/README.md#end-of-life-releases"},"end of life status")," December 31st, 2019. Teams still on node 8 will need to upgrade to node 10."),(0,o.mdx)("p",null,"We plan to start upgrading our node version on a more routine cadence following this transition. Our range of node version support is restricted by our transitive dependency on ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/laverdet/node-fibers"},"fibers")," which is necessary for running our WebDriverIO testing environment ",(0,o.mdx)("a",{parentName:"p",href:"https://v6.webdriver.io/docs/sync-vs-async.html"},"synchronously"),"."),(0,o.mdx)("h3",{id:"assertion-framework"},"Assertion Framework"),(0,o.mdx)("p",null,"We've removed the ",(0,o.mdx)("a",{parentName:"p",href:"https://www.chaijs.com/"},"chai assertion framework")," and opted into using the built in ",(0,o.mdx)("a",{parentName:"p",href:"https://v6.webdriver.io/docs/assertion.html"},"assertion library")," that ships with WebDriverIO. This new assertion framework closely resembles the testing environment most of us are used to in Jest, because it is ",(0,o.mdx)("a",{parentName:"p",href:"https://jestjs.io/docs/en/expect"},"Jest's expect library"),". This should help align testing between Jest and WebDriverIO."),(0,o.mdx)("p",null,"A few common changes look something like this:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"- expect(true).to.be.true; // Chai assertion\n+ expect(true).toBe(true); // Expect/Jest assertion.\n\n- expect(true).to.be.false; // Chai assertion\n+ expect(true).toBe(false); // Expect/Jest assertion.\n\n- expect(1).to.equal(1); // Chai assertion\n+ expect(1).toEqual(1); // Expect/Jest assertion.\n")),(0,o.mdx)("p",null,"WebDriverIO provides a collection of ",(0,o.mdx)("a",{parentName:"p",href:"https://v6.webdriver.io/docs/api/expect.html"},"matchers")," that can be used for assertions in your tests."),(0,o.mdx)("h3",{id:"terra-commands"},"Terra Commands"),(0,o.mdx)("p",null,"The ",(0,o.mdx)("inlineCode",{parentName:"p"},"Terra.it")," commands have been removed. We noticed they encouraged anti-patterns while writing tests and made testing more confusing."),(0,o.mdx)("p",null,"These commands have been removed:"),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},"Terra.it.validatesElement"),(0,o.mdx)("li",{parentName:"ul"},"Terra.it.isAccessible"),(0,o.mdx)("li",{parentName:"ul"},"Terra.it.matchesScreenshot")),(0,o.mdx)("p",null,"These commands can still be used but have had some changes:"),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},"Terra.validates.accessibility"),(0,o.mdx)("li",{parentName:"ul"},"Terra.validates.element"),(0,o.mdx)("li",{parentName:"ul"},"Terra.validates.screenshot")),(0,o.mdx)("p",null,"The validates screenshot and validates element commands now require a screenshot name."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"it('should click and validate the element', () => {\n  $('#element').click();\n\n  Terra.validates.element('screenshot name'); //  A unique screenshot name must be provided or the command will throw an error.\n});\n")),(0,o.mdx)("p",null,"The ",(0,o.mdx)("inlineCode",{parentName:"p"},"viewports")," option has been removed from ",(0,o.mdx)("inlineCode",{parentName:"p"},"Terra.validates.screenshot"),". The viewport option array created additional viewport permutations within other viewport permutations. To more consistently align viewport testing the option was removed. To specify an array of viewports use the ",(0,o.mdx)("inlineCode",{parentName:"p"},"Terra.describeViewports")," helper."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"+ Terra.describeViewports('Terra.validates', ['tiny', 'small'], () => {\n   it('should click and validate the element', () => {\n     $('#element').click();\n\n-     Terra.validates.screenshot('screenshot name', { viewports: ['tiny', 'small'] });\n+     Terra.validates.screenshot('screenshot name');\n   });\n+ });\n")),(0,o.mdx)("h3",{id:"screenshots"},"Screenshots"),(0,o.mdx)("p",null,"We've forked and taken ownership of the visual regression service to give us better control of making changes when necessary. Over time we'll be working to resolve common errors encountered with the visual regression service. Such as the notorious x,y range error."),(0,o.mdx)("p",null,"For now though, there are a few breaking changes to the screenshot strategy that will require regenerating screenshots."),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},"Screenshot names are no longer auto-generated using the describe blocks."),(0,o.mdx)("li",{parentName:"ul"},"Screenshots now require a unique name be provided. No screenshots within the same spec file should be identical. Screenshots in other spec files are not affected."),(0,o.mdx)("li",{parentName:"ul"},"Screenshots will be scoped under a theme when written to file under ","_","_snapshots__.")),(0,o.mdx)("p",null,"We've removed the string concatenation of describe blocks to form a screenshot filename. Previously, the following example would generate a screenshot name of ",(0,o.mdx)("inlineCode",{parentName:"p"},"block_1_block_2_screenshot_name"),"."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"describe('block 1', () => {\n  describe('block 2', () => {\n    it('should generate a screenshot', () => {\n      Terra.validates.element('screenshot name'); // Previously screen generated as block_1_block_2_screenshot_name.\n    });\n  });\n});\n")),(0,o.mdx)("p",null,"This was causing/forcing teams to modify their test structure to produce a meaningful screenshot name. A screenshot could be generated with a tremendously long filename and required sanitizing each of the block descriptions to remove special characters. Describe blocks should be used to describe and group tests together. They should not be introducing side effects to the generated screenshot name."),(0,o.mdx)("p",null,"Moving forward, a unique name must be provided for the screenshot. This should help shorten screenshot names, provide a meaningful name, and encourage developers to write tests semantically."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"describe('block 1', () => {\n  describe('block 2', () => {\n    it('should generate a screenshot', () => {\n      Terra.validates.element('unique screenshot name'); // This will now generate a screenshot named unique_screenshot_name.\n    });\n  });\n});\n")),(0,o.mdx)("p",null,"As theming has become more prevalent in our ecosystem screenshots are now always written into a theme directory in ","_","_snapshots__. If your application does not explicitly use a theme the screenshots will output under the default ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra-default-theme")," directory. This change will require regenerating screenshots to move them into the appropriate theme directory."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre"},"├── __snapshots__\n│   ├── reference\n│   │   ├── clinical-lowlight-theme\n│   │   │   └── en\n│   │   │       └── chrome_huge\n│   │   │           └── example-spec\n│   │   │               ├── screenshot-1.png\n│   │   │               └── screenshot-2.png\n│   │   ├── orion-fusion-theme\n│   │   │   └── en\n│   │   │       └── chrome_huge\n│   │   │           └── example-spec\n│   │   │               ├── screenshot-1.png\n│   │   │               └── screenshot-2.png\n│   │   └── terra-default-theme\n│   │       └── en\n│   │           └── chrome_huge\n│   │               └── example-spec\n│   │                   ├── screenshot-1.png\n│   │                   └── screenshot-2.png\n")),(0,o.mdx)("h3",{id:"timezone"},"Timezone"),(0,o.mdx)("p",null,"The ",(0,o.mdx)("inlineCode",{parentName:"p"},"American/Chicago")," timezone has been removed from the docker images. The timezone will default to the timezone provided by the docker image. This will align the selenium grid and local docker images to the same timezone."),(0,o.mdx)("h3",{id:"accessibility-testing"},"Accessibility Testing"),(0,o.mdx)("p",null,"The dependency on ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/dequelabs/axe-core"},"axe-core")," has been upgraded from v3.5.3 to v4.0.2. There were no new rules introduced, but previous rules had fixes added that might start detecting accessibility violations after the upgrade that were not previously being detected."),(0,o.mdx)("p",null,"Check out the ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/dequelabs/axe-core/releases"},"release notes")," for more detail information about the changes."),(0,o.mdx)("h3",{id:"default-selector"},"Default Selector"),(0,o.mdx)("p",null,"The default selector has been changed from ",(0,o.mdx)("inlineCode",{parentName:"p"},"[data-terra-dev-site-content] *:first-child")," to ",(0,o.mdx)("inlineCode",{parentName:"p"},"[data-terra-test-content] *:first-child"),". This selector is used as the default content region for capturing screenshots. This change should not affect most teams. For teams that are affected a custom selector can be provided using ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/terra-functional-testing/wdio-services/terra-service"},"service options"),"."),(0,o.mdx)("h3",{id:"accessing-the-formfactor-locale-or-theme-options"},"Accessing the ",(0,o.mdx)("inlineCode",{parentName:"h3"},"formFactor"),", ",(0,o.mdx)("inlineCode",{parentName:"h3"},"locale"),", or ",(0,o.mdx)("inlineCode",{parentName:"h3"},"theme")," options"),(0,o.mdx)("p",null,"The ",(0,o.mdx)("inlineCode",{parentName:"p"},"formFactor"),", ",(0,o.mdx)("inlineCode",{parentName:"p"},"locale"),", and ",(0,o.mdx)("inlineCode",{parentName:"p"},"theme")," options that used to be available in the ",(0,o.mdx)("inlineCode",{parentName:"p"},"browser.options")," global object no longer reside in this object. These options along with other data are now available in the ",(0,o.mdx)("inlineCode",{parentName:"p"},"Terra.serviceOptions")," global object."),(0,o.mdx)("h3",{id:"accessing-the-browser-object"},"Accessing the ",(0,o.mdx)("inlineCode",{parentName:"h3"},"browser")," object"),(0,o.mdx)("p",null,"Any usage of the ",(0,o.mdx)("inlineCode",{parentName:"p"},"browser")," global object should be moved inside the ",(0,o.mdx)("inlineCode",{parentName:"p"},"it")," block because ",(0,o.mdx)("inlineCode",{parentName:"p"},"browser")," will be ",(0,o.mdx)("inlineCode",{parentName:"p"},"undefined")," when accessed outside the scope of the ",(0,o.mdx)("inlineCode",{parentName:"p"},"it")," block. This reason for this behavior is due to how the WebDriverIO testing lifecycle hooks are implemented in v6."),(0,o.mdx)("h2",{id:"new-features"},"New Features"),(0,o.mdx)("h3",{id:"accessibility-reporter"},"Accessibility Reporter"),(0,o.mdx)("p",null,"A custom WebDriverIO reporter has been created to facilitate monitoring accessibility violations and reporting them upon the completion of the test run. The goal of this reporter is to allow us to more frequently upgrade our version of axe-core without as many breaking changes. When axe adds new rules those rules can be marked as warnings and the accessibility reporter will report them to the terminal without failing as a violation. Please monitor your terminal output to stay proactive on accessibility warnings."),(0,o.mdx)("h3",{id:"terra-cli"},"Terra CLI"),(0,o.mdx)("p",null,"Our command line interface has been transitioned to ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/terra-cli/about"},"Terra CLI")," to create a uniform experience across our scripts. All new commands are integrated plugins for the terra-cli. Command options are constructed using ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/yargs/yargs"},"yargs"),";"),(0,o.mdx)("p",null,"As part of this upgrade teams will be updating the scripts used to invoke wdio to use the terra-cli commands. The ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra wdio")," script will invoke the test runner."),(0,o.mdx)("p",null,"Note: The terra cli array parameters have a different syntax. ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/yargs/yargs/blob/master/docs/api.md#array"},"Array")," items are now delimited by a space."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},'// package.json\n{\n  "scripts": {\n-    "test:wdio": "wdio"\n+    "test:wdio": "terra wdio"\n-    "test:wdio:local": "tt-wdio --gridUrl=\'grid.test.example.com\' --locales=[\'de\',\'en-AU\'] --browsers=[\'chrome\',\'firefox\',\'ie\']"\n+    "test:wdio:local": "terra wdio --gridUrl grid.test.example.com --locales de en-AU --browsers chrome firefox ie"\n  }\n}\n')),(0,o.mdx)("h3",{id:"auto-update-screenshots"},"Auto Update Screenshots"),(0,o.mdx)("p",null,"A CLI option has been added to auto-update reference screenshots during the test run. When enabled all screenshots generated during the test run will automatically overwrite the existing reference screenshot. Be sure to manually validate screenshot updates when using this feature."),(0,o.mdx)("p",null,"Via the Terra CLI:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"terra wdio --updateScreenshots\n\n# -u is a shortcut for the same command\nterra wdio -u\n")),(0,o.mdx)("h3",{id:"vpn-support"},"VPN Support"),(0,o.mdx)("p",null,"We've added support to automatically detect the VPN IP address. It is no longer necessary to manually specify the ",(0,o.mdx)("inlineCode",{parentName:"p"},"WDIO_EXTERNAL_HOST")," when running wdio. These changes were tested successfully on Mac OS Catalina. Results may vary when running on different platforms and operating systems. It's not perfect and we'll make tweaks as necessary. If this is not working for you let us know. Be sure to specify the operating system and platform you're developing on."),(0,o.mdx)("h2",{id:"how-to-upgrade"},"How to Upgrade"),(0,o.mdx)("p",null,"There are a few prerequisites to get started. We'll be removing ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra-toolkit")," as a dependency later in this guide. Removing ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra-toolkit")," is going to impact starting the local development site and webpack configurations. The first step of this transition will be to upgrade to ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/about"},"@cerner/webpack-config-terra"),"."),(0,o.mdx)("h3",{id:"upgrading-webpack"},"Upgrading Webpack"),(0,o.mdx)("p",null,"If you are already using @cerner/webpack-config-terra ^1.0.0 you can skip this section."),(0,o.mdx)("p",null,"A complete upgrade guide can be found ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/upgrade-guide"},"here"),". Webpack can be upgraded separately from terra-functional-testing. This change does not need to be bundled with test updates, but it does need to happen before the test updates."),(0,o.mdx)("p",null,"Install @cerner/webpack-config-terra, @cerner/terra-aggregate-translations, and postcss ^8.2.1 (a required peer dependency of webpack-config-terra):"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm install --save-dev @cerner/webpack-config-terra @cerner/terra-aggregate-translations postcss@8.2.1\n")),(0,o.mdx)("p",null,"If your project utilizes the ",(0,o.mdx)("inlineCode",{parentName:"p"},"tt-serve-static")," bin command go ahead and install ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/terra-cli/about"},"terra-cli")," as you'll need it to upgrade the static asset utilities:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm install --save-dev @cerner/terra-cli\n")),(0,o.mdx)("p",null,"Update any references to the old webpack configuration:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"// webpack.config.js\n- const webpackConfig = require('terra-dev-site/config/webpack/webpack.config');\n+ const webpackConfig = require('@cerner/webpack-config-terra');\n")),(0,o.mdx)("p",null,"Update any references to the old terra-aggregate-translations:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"// jestGlobalSetup.js\n- const aggregateTranslations = require('terra-aggregate-translations');\n+ const aggregateTranslations = require('@cerner/terra-aggregate-translations');\n")),(0,o.mdx)("p",null,"Update any scripts in the package.json to use webpack-dev-server. Use terra-cli for any static sites. Remove any reference to ",(0,o.mdx)("inlineCode",{parentName:"p"},"tt-clean-screenshots")," since cleaning the ",(0,o.mdx)("inlineCode",{parentName:"p"},"diff"),", ",(0,o.mdx)("inlineCode",{parentName:"p"},"latest"),", and ",(0,o.mdx)("inlineCode",{parentName:"p"},"error")," screenshot directories is now executed automaticatically for each test run. Remove ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra-aggregate-translations")," if installed:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},'// package.json\n{\n  "scripts": {\n-    "clean:obsolete-wdio-snapshots": "tt-clean-screenshots",\n-    "start": "tt-serve",\n-    "start-prod": "tt-serve --env.disableHotReloading -p",\n-    "start-static": "npm run pack && tt-serve-static",\n+    "start": "webpack-dev-server",\n+    "start-prod": "webpack-dev-server --env.disableHotReloading -p",\n+    "start-static": "npm run pack && terra express-server --site ./build",\n  },\n  "devDependencies": {\n+   "@cerner/terra-aggregate-translations": "^2.0.1",\n+   "@cerner/terra-cli": "^1.3.0",\n+   "@cerner/webpack-config-terra": "^1.2.0",\n+   "postcss": "^8.2.1",\n-   "terra-aggregate-translations": "^1.0.0"\n  }\n}\n')),(0,o.mdx)("p",null,"At this point it is recommended to do a clean install prior to testing each of the scripts. If you have the script go ahead and run ",(0,o.mdx)("inlineCode",{parentName:"p"},"npm run clean:install"),". Alternatively ensure that the old node_modules directory is deleted and reinstall all dependencies."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm run clean:install\n")),(0,o.mdx)("p",null,"Verify each of the scripts are working as intended:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm run start\n\nnpm run start-prod\n\nnpm run start-static\n")),(0,o.mdx)("p",null,"Note: If you don't have some of these commands it is not necessary to add them. Just ensure the commands you do have are working as expected. All of the ",(0,o.mdx)("inlineCode",{parentName:"p"},"tt-serve")," commands should be updated to use webpack-dev-server or the terra express server."),(0,o.mdx)("h3",{id:"upgrading-eslint-config-terra"},"Upgrading ESlint Config Terra"),(0,o.mdx)("p",null,"If you are already using @cerner/eslint-config-terra ^5.0.0 you can skip this section."),(0,o.mdx)("p",null,"Upgrading ",(0,o.mdx)("inlineCode",{parentName:"p"},"@cerner/eslint-config-terra")," is optional, but recommended. WebDriverIO v6 syntax requires using the ",(0,o.mdx)("inlineCode",{parentName:"p"},"$")," global which has been ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-toolkit/pull/548"},"added")," to the eslint config. If you choose not to upgrade eslint-config-terra at this time you will need to add the global declaration manually in each spec file."),(0,o.mdx)("p",null,"Adding the global manually to each spec file is only necessary if you are not upgrading to @cerner/eslint-config-terra ^5.0.0:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"/* global $ */\n")),(0,o.mdx)("p",null,"A complete upgrade guide can be found ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-toolkit/blob/main/packages/eslint-config-terra/UpgradeGuide.md#eslint-config-terra-upgrade-guide"},"here"),"."),(0,o.mdx)("p",null,"Install @cerner/eslint-config-terra:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm install --save-dev @cerner/eslint-config-terra\n")),(0,o.mdx)("p",null,"Remove the old ",(0,o.mdx)("inlineCode",{parentName:"p"},"eslint-config-terra")," and extend ",(0,o.mdx)("inlineCode",{parentName:"p"},"@cerner/terra")," from the ",(0,o.mdx)("inlineCode",{parentName:"p"},"eslintConfig")," key:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},'// package.json\n{\n  "eslintConfig": {\n-   "extends": "terra",\n+   "extends": "@cerner/terra",\n  },\n  "devDependencies": {\n-    "eslint-config-terra": "^3.3.0",\n+    "@cerner/eslint-config-terra": "^5.0.0",\n+    "eslint": "^7.0.0" // Upgrade ESlint to v7.\n  }\n}\n')),(0,o.mdx)("p",null,"At this point it is recommended to do a clean install prior to running lint. If you have the script go ahead and run ",(0,o.mdx)("inlineCode",{parentName:"p"},"npm run clean:install"),". Alternatively ensure that the old node_modules directory is deleted and reinstall all dependencies."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm run clean:install\n")),(0,o.mdx)("p",null,"Run eslint and resolve any of the new violations introduced by the new version of ESLint plugins transitively introduced."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm run lint\n")),(0,o.mdx)("h3",{id:"installing-terra-functional-testing"},"Installing Terra Functional Testing"),(0,o.mdx)("p",null,"After upgrading webpack and eslint your project is ready to start the migration to @cerner/terra-functional-testing. Before getting started make sure you're prepared to work through the entire uplift. We'll be removing the dependency on terra-toolkit. The implications are that the entire test suite needs to be uplifted. Our recommendation will be to split up the work and go through each spec file one by one. Enabling only the tests you are currently uplifting and disabling the others."),(0,o.mdx)("p",null,"Install @cerner/terra-functional-testing and @cerner/terra-cli:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm install --save-dev @cerner/terra-functional-testing @cerner/terra-cli\n")),(0,o.mdx)("p",null,"Remove terra-toolkit from the package.json:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},'// package.json\n{\n  "devDependencies": {\n-   "terra-toolkit": "^6.0.0",\n+   "@cerner/terra-cli": "^1.0.0",\n+   "@cerner/terra-functional-testing": "^1.0.0"\n  }\n}\n')),(0,o.mdx)("p",null,"Update any references to the previous ",(0,o.mdx)("inlineCode",{parentName:"p"},"wdio.conf.js"),":"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"// wdio.conf.js\n- const wdioConfig = require('terra-toolkit/config/wdio/wdio.conf');\n+ const { config } = require('@cerner/terra-functional-testing');\n\n- module.exports = wdioConfig;\n+ exports.config = config;\n")),(0,o.mdx)("p",null,"Update scripts to use the Terra CLI:"),(0,o.mdx)("p",null,"Note: The terra cli array parameters have a different syntax."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},'// package.json\n{\n  "scripts": {\n-    "test:wdio": "wdio"\n+    "test:wdio": "terra wdio"\n-    "test:wdio:local": "tt-wdio --gridUrl=\'grid.test.example.com\' --locales=[\'de\',\'en-AU\'] --browsers=[\'chrome\',\'firefox\',\'ie\']"\n+    "test:wdio:local": "terra wdio --gridUrl grid.test.example.com --locales de en-AU --browsers chrome firefox ie"\n  }\n}\n')),(0,o.mdx)("p",null,"A list of the test runner CLI options can be found ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/dev_tools/cerner-terra-toolkit-docs/terra-functional-testing/about"},"here"),"."),(0,o.mdx)("p",null,"At this point it is recommended to do a clean install to remove stale installations of terra-toolkit. If you have the script go ahead and run ",(0,o.mdx)("inlineCode",{parentName:"p"},"npm run clean:install"),". Alternatively ensure that the old node_modules directory is deleted and reinstall all dependencies."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"npm run clean:install\n")),(0,o.mdx)("h3",{id:"upgrading-tests"},"Upgrading Tests"),(0,o.mdx)("p",null,"From here you are ready to start upgrading each of the spec files within your project. We recommend you uplifting each spec one by one by modifying the ",(0,o.mdx)("inlineCode",{parentName:"p"},"wdio.config.js"),". We used this strategy ourselves during our uplift and we think it helps."),(0,o.mdx)("p",null,"Choose a spec file to uplift and limit the test run to only that file."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"// wdio.conf.js\nconst { config } = require('@cerner/terra-functional-testing');\n\nconfig.specs = [\n  '/tests/wdio/path/example-spec',\n]\n\nexports.config = config;\n")),(0,o.mdx)("p",null,"Here are some resources you'll want to bookmark as you work through each spec file."),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},(0,o.mdx)("a",{parentName:"li",href:"http://v4.webdriver.io/api.html"},"WebDriverIO v4 API")),(0,o.mdx)("li",{parentName:"ul"},(0,o.mdx)("a",{parentName:"li",href:"https://v6.webdriver.io/docs/api.html"},"WebDriverIO v6 API"))),(0,o.mdx)("p",null,"Work through the spec file and update the deprecated browser commands. Read through the ",(0,o.mdx)("a",{parentName:"p",href:"#webdriverio-v4-to-v6"},"WebDriverIO breaking changes")," section above for more information."),(0,o.mdx)("p",null,"Here are a few of the most common scenarios we encountered:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"// Clicks\n- browser.click('#element');\n+ $('#element').click();\n\n// Set Value\n- browser.setValue('input', 'value');\n+ $('input').setValue('value');\n\n// Add Value\n- browser.addValue('input', 'value');\n+ $('input').addValue('value');\n\n// Wait For Visible\n- browser.waitForVisible('#element');\n+ $('#element').waitForDisplayed();\n\n// Move To\n- browser.moveToObject('#element', 0, 10);\n+ $('#element').moveTo({ xOffset: 0, yOffset: 10 });\n")),(0,o.mdx)("p",null,"Update any chai assertions to expect assertions. Read through the ",(0,o.mdx)("a",{parentName:"p",href:"#assertion-framework"},"assertion breaking changes")," section above for more information."),(0,o.mdx)("p",null,"A few common changes look something like this:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-diff"},"- expect(true).to.be.true; // Chai assertion\n+ expect(true).toBe(true); // Expect/Jest assertion.\n\n- expect(true).to.be.false; // Chai assertion\n+ expect(true).toBe(false); // Expect/Jest assertion.\n\n- expect(1).to.equal(1); // Chai assertion\n+ expect(1).toEqual(1); // Expect/Jest assertion.\n")),(0,o.mdx)("p",null,"Ensure each ",(0,o.mdx)("inlineCode",{parentName:"p"},"Terra.validates.element")," and ",(0,o.mdx)("inlineCode",{parentName:"p"},"Terra.validates.screenshot")," is provided a unique name. Read through the ",(0,o.mdx)("a",{parentName:"p",href:"#screenshots"},"screenshots")," section above for more information."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"it('should click and validate the element', () => {\n  $('#element').click();\n\n  Terra.validates.element('screenshot name'); //  A unique screenshot name must be provided or the command will throw an error.\n});\n")),(0,o.mdx)("p",null,"Delete all screenshots associated to that spec file and initiate the test runner to regenerate screenshots. Resolve any errors that are thrown. Ensure every test generating a screenshot provides a unique screenshot name. Once the test run is successful move on to the next spec file and repeat the process."),(0,o.mdx)("p",null,"The following example will throw a mismatch error because two screenshots are being generated with the same name."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"// example-spec.js\n\nit('should click and validate the element', () => {\n  $('#element-1').click();\n\n  Terra.validates.element('screenshot name');\n});\n\nit('should click and validate the element', () => {\n  $('#element-2').click();\n\n  Terra.validates.element('screenshot name'); //  Will throw an error because a previous screenshot was generated with the same name.\n});\n")),(0,o.mdx)("h2",{id:"the-future---webdriverio-v7---node-12"},"The Future - WebDriverIO v7 - Node 12"),(0,o.mdx)("p",null,"WebDriverIO v7 was released on ",(0,o.mdx)("a",{parentName:"p",href:"https://webdriver.io/blog/2021/02/09/webdriverio-v7-released"},"February 9th, 2021")," and is on our radar. We'll be focusing on getting teams upgraded onto WebDriverIO v6 and node >= 10 as a stepping stone before releasing an upgrade to WebDriverIO v7. The changes from WebDriverIO v6 to v7 drop support for node 10 and appear to largely only impact typescript declarations. We'll investigate the breaking changes and work necessary for upgrading. We plan to release an upgrade in the near future pending the investigation and transition strategy for node >= 12."))}d.isMDXComponent=!0},58168:function(e,t,n){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},r.apply(this,arguments)}n.d(t,{A:function(){return r}})},53986:function(e,t,n){function r(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}n.d(t,{A:function(){return r}})}}]);