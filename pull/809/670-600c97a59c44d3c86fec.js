"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[670],{22863:function(e,t,n){var a=n(64836);t.Z=void 0;var r=a(n(67294)),l=a(n(45697)),i=a(n(47166)),o=a(n(17422)),s=i.default.bind(o.default),d={name:l.default.string.isRequired,src:l.default.string,url:l.default.string,version:l.default.string.isRequired},m=function(e){var t=e.src,n=e.name,a=e.url,l=e.version,i=r.default.createElement("a",{className:s("badge"),href:a||"https://www.npmjs.org/package/".concat(n,"/v/").concat(l)},r.default.createElement("span",{className:s("badge-name")},a?"package":"npm"),r.default.createElement("span",{className:s("badge-version")},"v".concat(l))),o=t?r.default.createElement("a",{className:s("badge"),href:t},r.default.createElement("span",{className:s("badge-name")},"github"),r.default.createElement("span",{className:s("badge-version")},"source")):void 0;return r.default.createElement("div",{className:s("badge-container")},i,o)};m.propTypes=d;var c=m;t.Z=c},40996:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=d(n(67294)),r=d(n(45697)),l=d(n(47166)),i=d(n(50026)),o=d(n(66983)),s=["children"];function d(e){return e&&e.__esModule?e:{default:e}}function m(){return m=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},m.apply(this,arguments)}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=l.default.bind(o.default),p=function(e){e.currentTarget.setAttribute("data-focus-styles-enabled","true")},h=function(e){e.currentTarget.setAttribute("data-focus-styles-enabled","false")},f={children:r.default.string},g=function(e){var t=e.children,n=c(e,s),r=a.default.useContext(i.default),o=(0,l.default)(u(["button",r.className]),n.className);return a.default.createElement("button",m({},n,{type:"button",className:o,onBlur:p,onMouseDown:h,"data-focus-styles-enabled":!0}),t)};g.propTypes=f;var x=g;t.default=x},59278:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=s(n(67294)),r=s(n(45697)),l=s(n(47166)),i=s(n(50026)),o=s(n(30866));function s(e){return e&&e.__esModule?e:{default:e}}var d=l.default.bind(o.default),m={ariaLevel:r.default.oneOf(["2","3","4","5","6"]),children:r.default.node,variant:r.default.oneOf(["ux-recommendation","caution","deprecation","maintenance","important","not-supported"])},c=function(e){var t=e.ariaLevel,n=e.variant,r=e.children,l=a.default.useContext(i.default);return a.default.createElement("div",{className:d("notice",n,l.className)},a.default.createElement("div",{className:d("accessory"),"aria-hidden":"true",focusable:"false"}),a.default.createElement("div",{role:"heading",className:d("title"),"aria-level":t},a.default.createElement("span",null,function(e){return"ux-recommendation"===e?"UX Recommendation":"caution"===e?"Caution":"deprecation"===e?"Deprecation Notice":"maintenance"===e?"In Maintenance":"important"===e?"Important":"not-supported"===e?"Hazards for Incorrect Usage":"error"}(n))),a.default.createElement("div",{className:d("children")},function(e){return"not-supported"===e?a.default.createElement(a.default.Fragment,null,a.default.createElement("p",{className:d("paragraph")},"This component was designed and tested according to the documented implementation."),a.default.createElement("p",{className:d("paragraph")},"Using the component incorrectly:",a.default.createElement("ul",{className:d("list")},a.default.createElement("li",null,"will likely result in improper composition and create accessibility issues"),a.default.createElement("li",null,"may cause erratic or broken behaviors and styles"),a.default.createElement("li",null,a.default.createElement("strong",null,"will not be supported "),"or enhanced to allow for incorrect use")))):null}(n),a.default.Children.map(r,(function(e){return"string"==typeof e?a.default.createElement("p",null,e):e}))))};c.propTypes=m,c.defaultProps={ariaLevel:"2",variant:"important"};var u=c;t.default=u},47306:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=m(n(67294)),r=m(n(45697)),l=m(n(94184)),i=m(n(47166)),o=m(n(50026)),s=m(n(42620)),d=["title"];function m(e){return e&&e.__esModule?e:{default:e}}function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},c.apply(this,arguments)}function u(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=i.default.bind(s.default),h={title:r.default.string},f=function(e){var t=e.title,n=u(e,d),r=a.default.useContext(o.default),i=(0,l.default)(p(["placeholder",r.className]),n.className),s=p(["inner"]);return a.default.createElement("div",c({},n,{className:i}),a.default.createElement("div",{className:s},a.default.createElement("p",{className:p("title")},t)))};f.propTypes=h,f.defaultProps={title:""};var g=f;t.default=g},34261:function(e,t,n){Object.defineProperty(t,"qX",{enumerable:!0,get:function(){return a.default}});var a=i(n(59278)),r=i(n(47306)),l=i(n(40996));function i(e){return e&&e.__esModule?e:{default:e}}},74429:function(e,t,n){n.r(t),n.d(t,{default:function(){return c}});var a=n(87462),r=n(44925),l=(n(67294),n(81254)),i=n(34261),o=n(87510),s=["components"],d={},m="wrapper";function c(e){var t=e.components,n=(0,r.Z)(e,s);return(0,l.mdx)(m,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.mdx)(o.C,{mdxType:"Badge"}),(0,l.mdx)("h1",{id:"terra-functional-testing"},"Terra Functional Testing"),(0,l.mdx)("p",null,"The terra-functional-testing library is a utility for developing automation tests. The library extends ",(0,l.mdx)("a",{parentName:"p",href:"https://v6.webdriver.io/"},"WebdriverIO")," to facilitate automating accessibility and functional testing for Terra projects."),(0,l.mdx)("h2",{id:"system-requirements"},"System Requirements"),(0,l.mdx)("ul",null,(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("a",{parentName:"li",href:"http://nodejs.org/"},"Node.js")," Install at least v10.24.0. Due to requirements of fibers used within the project install no greater than lts/erbium (v12)."),(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("a",{parentName:"li",href:"https://www.docker.com/"},"Docker")," Install docker. Docker is used to setup and run tests in a containerized environment.")),(0,l.mdx)("p",null,"We strongly recommend using ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/nvm-sh/nvm"},"nvm")," for installing node versions."),(0,l.mdx)("h2",{id:"installation"},"Installation"),(0,l.mdx)("p",null,"Install @cerner/terra-functional-testing and @cerner/terra-cli as development dependencies with npm:"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre"},"npm install --save-dev @cerner/terra-functional-testing @cerner/terra-cli\n")),(0,l.mdx)("h2",{id:"usage"},"Usage"),(0,l.mdx)("p",null,"A test runner is provided for local development. The test runner is invoked via the ",(0,l.mdx)("a",{parentName:"p",href:"/terra-toolkit/pull/809/dev_tools/cerner-terra-toolkit-docs/terra-cli/about"},"terra-cli"),"."),(0,l.mdx)("p",null,"package.json"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "test:wdio": "terra wdio"\n}\n')),(0,l.mdx)("h3",{id:"options"},"Options"),(0,l.mdx)("table",null,(0,l.mdx)("thead",{parentName:"table"},(0,l.mdx)("tr",{parentName:"thead"},(0,l.mdx)("th",{parentName:"tr",align:null},"Option"),(0,l.mdx)("th",{parentName:"tr",align:null},"Type"),(0,l.mdx)("th",{parentName:"tr",align:null},"Default"),(0,l.mdx)("th",{parentName:"tr",align:null},"Description"))),(0,l.mdx)("tbody",{parentName:"table"},(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--assetServerPort"),(0,l.mdx)("td",{parentName:"tr",align:null},"number"),(0,l.mdx)("td",{parentName:"tr",align:null},"8080"),(0,l.mdx)("td",{parentName:"tr",align:null},"The port to run the webpack and express asset services on.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--browsers"),(0,l.mdx)("td",{parentName:"tr",align:null},"array"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"A list of browsers for the test run.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--config, -c"),(0,l.mdx)("td",{parentName:"tr",align:null},"string"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"A file path to the test runner configuration.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--disableSeleniumService"),(0,l.mdx)("td",{parentName:"tr",align:null},"boolean"),(0,l.mdx)("td",{parentName:"tr",align:null},"false"),(0,l.mdx)("td",{parentName:"tr",align:null},"A flag to disable the selenium docker service.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--ignoreScreenshotMismatch"),(0,l.mdx)("td",{parentName:"tr",align:null},"boolean"),(0,l.mdx)("td",{parentName:"tr",align:null},"false"),(0,l.mdx)("td",{parentName:"tr",align:null},"A flag to ignore screenshot mismatch.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--externalHost"),(0,l.mdx)("td",{parentName:"tr",align:null},"string"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"The host address the testing environment is connected to.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--externalPort"),(0,l.mdx)("td",{parentName:"tr",align:null},"number"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"The port mapping from the host to the container.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--formFactors"),(0,l.mdx)("td",{parentName:"tr",align:null},"array"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"A list of form factors for the test run. One of tiny, small, medium, large, huge, or enormous")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--gridUrl"),(0,l.mdx)("td",{parentName:"tr",align:null},"string"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"The remote selenium grid address.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--locales"),(0,l.mdx)("td",{parentName:"tr",align:null},"array"),(0,l.mdx)("td",{parentName:"tr",align:null},"en"),(0,l.mdx)("td",{parentName:"tr",align:null},"A list of language locales for the test run.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--seleniumServicePort"),(0,l.mdx)("td",{parentName:"tr",align:null},"number"),(0,l.mdx)("td",{parentName:"tr",align:null},"4444"),(0,l.mdx)("td",{parentName:"tr",align:null},"The port mapping for the selenium service or the external selenium grid.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--seleniumServiceUrl"),(0,l.mdx)("td",{parentName:"tr",align:null},"string"),(0,l.mdx)("td",{parentName:"tr",align:null},"localhost"),(0,l.mdx)("td",{parentName:"tr",align:null},"The address for the selenium service.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--site"),(0,l.mdx)("td",{parentName:"tr",align:null},"string"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"A file path to a static directory of assets. When defined, an express server will launch to serve the assets and disable running webpack.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--spec"),(0,l.mdx)("td",{parentName:"tr",align:null},"array"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"A list of spec file paths.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--suite"),(0,l.mdx)("td",{parentName:"tr",align:null},"array"),(0,l.mdx)("td",{parentName:"tr",align:null}),(0,l.mdx)("td",{parentName:"tr",align:null},"Overrides specs and runs only the defined suites.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--themes"),(0,l.mdx)("td",{parentName:"tr",align:null},"array"),(0,l.mdx)("td",{parentName:"tr",align:null},"theme specified in terra-theme.config.js file"),(0,l.mdx)("td",{parentName:"tr",align:null},"A list of themes for the test run.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--updateScreenshots, -u"),(0,l.mdx)("td",{parentName:"tr",align:null},"boolean"),(0,l.mdx)("td",{parentName:"tr",align:null},"false"),(0,l.mdx)("td",{parentName:"tr",align:null},"Updates all reference screenshots with the latest screenshots.")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"--useHttps"),(0,l.mdx)("td",{parentName:"tr",align:null},"boolean"),(0,l.mdx)("td",{parentName:"tr",align:null},"false"),(0,l.mdx)("td",{parentName:"tr",align:null},"A flag to turn on secure HTTP for the webpack server when a gridUrl is provided.")))),(0,l.mdx)("p",null,"The following example will run the test suite a total of four times. Once for each permutation of the specified locales and form factors."),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "test:wdio": "terra wdio --locales en fr --formFactors tiny huge"\n}\n')),(0,l.mdx)("h2",{id:"browser-capabilities"},"Browser Capabilities"),(0,l.mdx)("p",null,"The following browsers are supported:"),(0,l.mdx)("ul",null,(0,l.mdx)("li",{parentName:"ul"},"Chrome"),(0,l.mdx)("li",{parentName:"ul"},"Firefox"),(0,l.mdx)("li",{parentName:"ul"},"Internet Explorer")),(0,l.mdx)("p",null,"Chrome is enabled by default when running locally against the docker container."),(0,l.mdx)("p",null,"To target a list of browsers that are different than the default use the ",(0,l.mdx)("inlineCode",{parentName:"p"},"browsers")," cli option:"),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"3",mdxType:"Notice"},(0,l.mdx)("p",null,"  Internet Explorer can only be enabled when running against a remote selenium grid. Internet Explorer is not available within the docker container.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "test:wdio": "terra wdio --browsers firefox"\n}\n')),(0,l.mdx)("p",null,"To run against a remote selenium grid:"),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"3",mdxType:"Notice"},(0,l.mdx)("p",null,"  Chrome, Firefox, and Internet Explorer are all enabled by default when running against a remote selenium grid.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "test:wdio": "terra wdio --gridUrl grid.test.example.com"\n}\n')),(0,l.mdx)("h2",{id:"form-factors"},"Form Factors"),(0,l.mdx)("p",null,"Tests can be executed in the following form factors:"),(0,l.mdx)("table",null,(0,l.mdx)("thead",{parentName:"table"},(0,l.mdx)("tr",{parentName:"thead"},(0,l.mdx)("th",{parentName:"tr",align:null},"Size"),(0,l.mdx)("th",{parentName:"tr",align:null},"Width"),(0,l.mdx)("th",{parentName:"tr",align:null},"Height"))),(0,l.mdx)("tbody",{parentName:"table"},(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"tiny"),(0,l.mdx)("td",{parentName:"tr",align:null},"470"),(0,l.mdx)("td",{parentName:"tr",align:null},"768")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"small"),(0,l.mdx)("td",{parentName:"tr",align:null},"622"),(0,l.mdx)("td",{parentName:"tr",align:null},"768")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"medium"),(0,l.mdx)("td",{parentName:"tr",align:null},"838"),(0,l.mdx)("td",{parentName:"tr",align:null},"768")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"large"),(0,l.mdx)("td",{parentName:"tr",align:null},"1020"),(0,l.mdx)("td",{parentName:"tr",align:null},"768")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"huge"),(0,l.mdx)("td",{parentName:"tr",align:null},"1300"),(0,l.mdx)("td",{parentName:"tr",align:null},"768")),(0,l.mdx)("tr",{parentName:"tbody"},(0,l.mdx)("td",{parentName:"tr",align:null},"enormous"),(0,l.mdx)("td",{parentName:"tr",align:null},"1500"),(0,l.mdx)("td",{parentName:"tr",align:null},"768")))),(0,l.mdx)("p",null,"To specify a list of form factors use the cli option:"),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"3",mdxType:"Notice"},(0,l.mdx)("p",null,"  If no form factor is specified all tests will be run against the huge form factor.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "test:wdio": "terra wdio --formFactors tiny small enormous"\n}\n')),(0,l.mdx)("h2",{id:"configuration"},"Configuration"),(0,l.mdx)("p",null,"The test runner ships with a default ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-toolkit/blob/main/packages/terra-functional-testing/src/config/wdio.conf.js"},"wdio.conf.js"),". Options can be configured by extending the default configuration file."),(0,l.mdx)("p",null,"To extend the default configuration create a ",(0,l.mdx)("inlineCode",{parentName:"p"},"wdio.conf.js")," file at the root of your project and apply the desired options."),(0,l.mdx)("p",null,"wdio.conf.js"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"const { config } = require('@cerner/terra-functional-testing');\n\n// Stop the test run if there is a test failure.\nconfig.bail = 1;\n\nexports.config = config;\n")),(0,l.mdx)("h2",{id:"service-options"},"Service Options"),(0,l.mdx)("p",null,"Service options are configurable by extending the wdio.conf.js file. These options are applied for every test run."),(0,l.mdx)("h3",{id:"selector"},"selector"),(0,l.mdx)("p",null,"Specifies the default element to be captured when taking a screenshot."),(0,l.mdx)("p",null,"Type: ",(0,l.mdx)("inlineCode",{parentName:"p"},"string")),(0,l.mdx)("p",null,"Required: ",(0,l.mdx)("inlineCode",{parentName:"p"},"false")),(0,l.mdx)("p",null,"Default: ",(0,l.mdx)("inlineCode",{parentName:"p"},"[data-terra-test-content] *:first-child")),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"4",mdxType:"Notice"},(0,l.mdx)("p",null,"  This selector is used as the default screenshot selector for Terra.validates.element and Terra.validates.screenshot.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"const { config } = require('@cerner/terra-functional-testing');\n\nconfig.serviceOptions = {\n  selector: '#root',\n};\n\nexports.config = config;\n")),(0,l.mdx)("h3",{id:"seleniumversion"},"seleniumVersion"),(0,l.mdx)("p",null,"Specifies the ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/SeleniumHQ/docker-selenium/tree/selenium-3"},"docker selenium")," version used within the docker container."),(0,l.mdx)("p",null,"Type: ",(0,l.mdx)("inlineCode",{parentName:"p"},"string")),(0,l.mdx)("p",null,"Required: ",(0,l.mdx)("inlineCode",{parentName:"p"},"false")),(0,l.mdx)("p",null,"Default: ",(0,l.mdx)("inlineCode",{parentName:"p"},"3.14.0-helium")),(0,l.mdx)(i.qX,{variant:"caution",ariaLevel:"4",mdxType:"Notice"},(0,l.mdx)("p",null,"  The selenium version is only applied when running tests against a docker container. This option does not change the version on a remote selenium grid. Keep this in mind if your tests run against a remote selenium grid on a CI system.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"const { config } = require('@cerner/terra-functional-testing');\n\nconfig.serviceOptions = {\n  seleniumVersion: '3.141.59-20210311',\n};\n\nexports.config = config;\n")),(0,l.mdx)("h2",{id:"test-utilities"},"Test Utilities"),(0,l.mdx)("p",null,"Test utilities are available to help write tests. These utilities are accessed using the ",(0,l.mdx)("inlineCode",{parentName:"p"},"Terra")," global object."),(0,l.mdx)("h3",{id:"describe-helpers"},"Describe Helpers"),(0,l.mdx)("p",null,"The describe helpers are an alias for the top level ",(0,l.mdx)("inlineCode",{parentName:"p"},"describe")," block used within spec files. The describe helpers provide useful features for limiting a set of tests to specific form factors, locales, and themes."),(0,l.mdx)("h4",{id:"terradescribeviewports"},"Terra.describeViewports"),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"5",mdxType:"Notice"},(0,l.mdx)("p",null,"  We recommended using Terra.describeTests instead of Terra.describeViewports. The same features in Terra.describeViewports can be achieved with Terra.describeTests.")),(0,l.mdx)("p",null,"The ",(0,l.mdx)("inlineCode",{parentName:"p"},"Terra.describeViewports")," utility defines a list of form factors the tests are enabled for. By default, all tests will be run against each provided viewport. If a form factor is specified via the cli the describe viewpoint helper works as a filter and only allows the tests to execute if they match the current form factor."),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"/**\n * Executes all tests for each defined viewport.\n * @param {string} title - The describe block title.\n * @param {string[]} viewports - A list of viewports. [tiny, small, medium, large, huge, enormous]\n * @param {function} fn - The block of tests to execute against each viewport.\n */\nTerra.describeViewports(title, [viewports], fn);\n")),(0,l.mdx)(i.qX,{variant:"caution",ariaLevel:"5",mdxType:"Notice"},(0,l.mdx)("p",null,"  Describe helpers should not be nested within other describe helpers.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"// The following example will scope the tests to run only for the `tiny` and `huge` form factors. The tests will not run for any other form factor.\n\nTerra.describeViewports('Describe viewports title', ['tiny', 'huge'], () => {\n  it('should test tiny and huge screens', () => {\n    browser.url('/testing/route/');\n\n    Terra.validates.screenshot('describe viewports');\n  });\n});\n\n// Multiple describe helpers can be used sequentially in the same spec file as long as they are not nested.\n\nTerra.describeViewports('Describe viewports title', ['small'], () => {\n  it('should test small screens', () => {\n    browser.url('/testing/route/small/');\n\n    Terra.validates.screenshot('describe viewports');\n  });\n});\n")),(0,l.mdx)("h4",{id:"terradescribetests"},"Terra.describeTests"),(0,l.mdx)("p",null,"The ",(0,l.mdx)("inlineCode",{parentName:"p"},"Terra.describeTests")," helper extends the ",(0,l.mdx)("inlineCode",{parentName:"p"},"Terra.describeViewports")," helper by additionally filtering tests by locale and theme. Tests within this helper will only be executed if each of the form factors, locales, and themes listed in the options match those defined in the configurations for the current test run. If no form factors, locales, or themes are provided as options, then all tests under this helper will qualify to run in any form factor, locale, or theme."),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"/**\n * Executes all tests for each defined set of form factors, locales, and themes.\n * @param {string} title - The describe block title.\n * @param {Object} options - An object containing arrays of formFactors, locales, and themes that the block of tests will only qualify to execute in.\n * @param {string} options.formFactors - The form factors that the block of tests only execute in.\n * @param {string} options.locales -  The language locales that the block of tests only execute in.\n * @param {string} options.themes - The themes that the block of tests only execute in.\n * @param {function} fn - The block of tests to execute based on the defined form factor, locale, and theme.\n */\nTerra.describeTests(title, options, fn);\n")),(0,l.mdx)("p",null,"The following tests will only be ran for the locales, themes, and form factors provided:"),(0,l.mdx)(i.qX,{variant:"caution",ariaLevel:"5",mdxType:"Notice"},(0,l.mdx)("p",null,"  The describe helper should not be nested inside of another describe helper.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"const testOptions = {\n  formFactors: ['tiny', 'huge'],\n  locales: ['en', 'fr'],\n  themes: ['terra-default-theme', 'orion-fusion-theme']\n}\n\nTerra.describeTests('Describe tests', testOptions, () => {\n  it('should execute only if form factor is tiny or huge, locale is en or fr, and theme is terra-default-theme or orion-fusion-theme', () => {\n    browser.url('/testing/route/');\n    Terra.validates.element('describe tests');\n  });\n});\n")),(0,l.mdx)("h3",{id:"accessibility-testing"},"Accessibility Testing"),(0,l.mdx)("p",null,"The testing library integrates ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/dequelabs/axe-core"},"axe-core")," into the testing framework to help automate accessibility testing along side functional testing."),(0,l.mdx)("p",null,"Axe will analyze the entire document when run and report accessibility violations. The following ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags"},"tags")," are enabled: ",(0,l.mdx)("inlineCode",{parentName:"p"},"wcag2a"),", ",(0,l.mdx)("inlineCode",{parentName:"p"},"wcag2aa"),", ",(0,l.mdx)("inlineCode",{parentName:"p"},"wcag21aa"),", and ",(0,l.mdx)("inlineCode",{parentName:"p"},"section508"),". Each tag has an associated list of ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md"},"rules")," that will be checked against the document when axe is run."),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"4",mdxType:"Notice"},(0,l.mdx)("p",null,"  Please note that not all accessibility testing can be automated. Axe provides a lightweight static analysis of the entire document to catch common accessibility violations, but it is the responsibility of each team and application to do thorough accessibility and functional testing manually when necessary.")),(0,l.mdx)("h4",{id:"terravalidatesaccessibility"},"Terra.validates.accessibility"),(0,l.mdx)("p",null,"The validates accessibility command will run accessibility checks on the entire document. If accessibility violations are found the test step will fail. It is recommended to run accessibility checks at various steps in a functional workflow to check for violations at different stages of the application."),(0,l.mdx)(i.qX,{variant:"caution",ariaLevel:"4",mdxType:"Notice"},(0,l.mdx)("p",null,"  The accessibility assertion must be used within an ",(0,l.mdx)("inlineCode",{parentName:"p"},"it")," block.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should report no accessibility violations', () => {\n  browser.url('/testing/route/');\n\n  Terra.validates.accessibility(); // Fails if accessibility violations are found anywhere on the document.\n});\n")),(0,l.mdx)("p",null,"The accessibility assertion accepts ",(0,l.mdx)("a",{parentName:"p",href:"https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter"},"options")," that will be passed to axe for the document analysis."),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should override a rule configuration', () => {\n  browser.url('/testing/route/');\n\n  // Rule override for this specific test.\n  const options = { rules: { 'color-contrast': { enabled: false } } };\n\n  Terra.validates.accessibility(options);\n});\n")),(0,l.mdx)("h3",{id:"screenshot-testing"},"Screenshot Testing"),(0,l.mdx)("p",null,"A screenshot can be captured at any given point inside an ",(0,l.mdx)("inlineCode",{parentName:"p"},"it")," block in a test. The element(s) being captured in the screenshot is determined by the provided selector option or the default ",(0,l.mdx)("inlineCode",{parentName:"p"},"[data-terra-test-content]")," selector if one is not provided. If part or all of the selector or any of its children are rendered outside the bounds of the current viewport, only what is within the viewport will be captured and what is outside the viewport will be clipped. The captured screenshot will be used as a reference artifact. Element validation is done by comparing the reference screenshot against the screenshot captured in future test runs at the same point in the test."),(0,l.mdx)("h4",{id:"terravalidatesscreenshot"},"Terra.validates.screenshot"),(0,l.mdx)("p",null,"Invoking the assertion will capture a screenshot at the time it is invoked. If no reference screenshot exists, one will be created in the ",(0,l.mdx)("inlineCode",{parentName:"p"},"reference")," folder with the given screenshot name. If such reference screenshot already exists, the new screenshot will be compared with the reference screenshot to validate visually that they are within the mismatch tolerance. If the mismatch exceeds the tolerance, the test step will fail and a screenshot showing the difference will be generated."),(0,l.mdx)(i.qX,{variant:"caution",ariaLevel:"5",mdxType:"Notice"},(0,l.mdx)("p",null,"  The screenshot assertion must be used within an ",(0,l.mdx)("inlineCode",{parentName:"p"},"it")," block and a screenshot name must be provided.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should validate the screenshot', () => {\n  browser.url('/testing/route/');\n\n  Terra.validates.screenshot('screenshot-name'); // Fails if the new screenshot doesn't visually match the reference screenshot.\n});\n")),(0,l.mdx)("p",null,"The screenshot naming pattern is as follows:"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"base_directory/test_spec_directory/test_spec_name/__snapshots__/(reference|latest|diff)/theme/locale/browserName_terraViewportName/screenshot-name.png\n")),(0,l.mdx)("p",null,"The screenshot assertion accepts an optional second argument with the following keys."),(0,l.mdx)("ul",null,(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("inlineCode",{parentName:"li"},"selector")," - The element selector to use to capture the element for screenshot comparison. The default selector is ",(0,l.mdx)("inlineCode",{parentName:"li"},"data-terra-test-content"),"."),(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("inlineCode",{parentName:"li"},"mismatchTolerance")," - The number between 0 and 100 that defines the degree of mismatch to consider two images as identical. Increasing this value will decrease level of test coverage. The default mismatch tolerance is 0.01.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should validate the screenshot with options', () => {\n  browser.url('/testing/route/');\n\n  const options = {\n    selector: '#element-id',\n    mismatchTolerance: 10,\n  };\n\n  Terra.validates.screenshot('screenshot-name', options);\n});\n")),(0,l.mdx)("h4",{id:"terravalidateselement"},"Terra.validates.element"),(0,l.mdx)("p",null,"The validates element assertion performs both accessibility and screenshot assertions."),(0,l.mdx)(i.qX,{variant:"caution",ariaLevel:"5",mdxType:"Notice"},(0,l.mdx)("p",null,"  The validates element assertion must be used within an ",(0,l.mdx)("inlineCode",{parentName:"p"},"it")," block and a screenshot name must be provided.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should validate the element', () => {\n  browser.url('/testing/route/');\n\n  Terra.validates.element('screenshot-name'); // Fails if the new screenshot doesn't visually match the reference screenshot.\n});\n")),(0,l.mdx)("p",null,"The element assertion accepts an optional second argument with the following keys."),(0,l.mdx)("ul",null,(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("inlineCode",{parentName:"li"},"rules")," - The accessibility ",(0,l.mdx)("a",{parentName:"li",href:"https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md"},"rules")," to use as overrides if necessary."),(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("inlineCode",{parentName:"li"},"selector")," - The element selector to use to capture the element for screenshot comparison. The default selector is ",(0,l.mdx)("inlineCode",{parentName:"li"},"data-terra-test-content"),"."),(0,l.mdx)("li",{parentName:"ul"},(0,l.mdx)("inlineCode",{parentName:"li"},"mismatchTolerance")," - The number between 0 and 100 that defines the degree of mismatch to consider two images as identical. Increasing this value will decrease level of test coverage. The default mismatch tolerance is 0.01.")),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should validate the element with options', () => {\n  browser.url('/testing/route/');\n\n  const options = {\n    rules: { 'color-contrast': { enabled: false } },\n    selector: '#element-id',\n    mismatchTolerance: 10,\n  };\n\n  Terra.validates.element('screenshot-name', options);\n});\n")),(0,l.mdx)("h3",{id:"additional-utilities"},"Additional Utilities"),(0,l.mdx)("h4",{id:"terrahideinputcaret"},"Terra.hideInputCaret"),(0,l.mdx)("p",null,"An editable text field in focus will have a blinking caret. Often times this blinking caret causes inconsistent test failures due to the blinking of the caret during screenshot capture. This situation can be avoided by using ",(0,l.mdx)("inlineCode",{parentName:"p"},"Terra.hideInputCaret")," to set the CSS caret color to of the element to be transparent. This method must be placed in a ",(0,l.mdx)("inlineCode",{parentName:"p"},"before"),", ",(0,l.mdx)("inlineCode",{parentName:"p"},"beforeEach"),", or ",(0,l.mdx)("inlineCode",{parentName:"p"},"it")," block or it will not be ran. This method accepts a selector string as an argument and will only apply to the first selector if multiple are found. The caret will automatically be hidden for body every time the page loads or refreshes."),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should hide the caret', () => {\n  Terra.hideInputCaret('#inputID');\n  const element = browser.element('#inputID');\n\n  expect(element.getCSSProperty('caretColor').value).toEqual('rgba(0,0,0,0)');\n});\n")),(0,l.mdx)("h4",{id:"terrasetapplicationlocale"},"Terra.setApplicationLocale"),(0,l.mdx)("p",null,"Use ",(0,l.mdx)("inlineCode",{parentName:"p"},"Terra.setApplicationLocale")," to update a terra application's locale on a case by case basis; particularly useful for testing locale changes on a deployed application. This method accepts a string containing the ",(0,l.mdx)("inlineCode",{parentName:"p"},"locale")," to update to."),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},"it('should update an application's locale, () => {\n  Terra.setApplicationLocale('en');\n});\n")),(0,l.mdx)("h2",{id:"remote-screenshots-migration"},"Remote Screenshots Migration"),(0,l.mdx)(i.qX,{variant:"important",ariaLevel:"3",mdxType:"Notice"},(0,l.mdx)("p",null,"  The Remote Screenshots Mirgation feature is currently only supported by internal projects built using Jenkins at Cerner Corporation. Open source projects that utilize other CI such as Travis are not supported.")),(0,l.mdx)("p",null,"Follow this ",(0,l.mdx)("a",{parentName:"p",href:"https://pages.github.cerner.com/orion/docs/doc/docs/nexus-wdio-screenshots-mirgation/about"},"consumption guide")," to utilize this feature."))}c.isMDXComponent=!0},87510:function(e,t,n){n.d(t,{C:function(){return l}});var a=n(67294),r=n(22863),l=function(e){var t=e.url;return a.createElement(r.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/terra-functional-testing",name:"@cerner/terra-functional-testing",version:"4.1.0",url:t})}},17422:function(e,t,n){n.r(t),t.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},66983:function(e,t,n){n.r(t),t.default={"clinical-lowlight-theme":"Button-module__clinical-lowlight-theme___TyZWB","orion-fusion-theme":"Button-module__orion-fusion-theme___q-FcQ",button:"Button-module__button___QuCn2","is-active":"Button-module__is-active___Z8AuK"}},30866:function(e,t,n){n.r(t),t.default={"clinical-lowlight-theme":"Notice-module__clinical-lowlight-theme___aa5xV","orion-fusion-theme":"Notice-module__orion-fusion-theme___QAE-T",notice:"Notice-module__notice___GWkPA",children:"Notice-module__children___lDYsm",accessory:"Notice-module__accessory___wkLOG",title:"Notice-module__title___6H5tc","ux-recommendation":"Notice-module__ux-recommendation___N8BuK",caution:"Notice-module__caution___hPrVl",deprecation:"Notice-module__deprecation___g1drA",maintenance:"Notice-module__maintenance___kWLIZ",important:"Notice-module__important___p5DiF","not-supported":"Notice-module__not-supported___34bHd",paragraph:"Notice-module__paragraph___5h-w1",list:"Notice-module__list___M2Kxj"}},42620:function(e,t,n){n.r(t),t.default={"clinical-lowlight-theme":"Placeholder-module__clinical-lowlight-theme___Obm9K","orion-fusion-theme":"Placeholder-module__orion-fusion-theme___svHY+",placeholder:"Placeholder-module__placeholder___ZZDXd",inner:"Placeholder-module__inner___fJq9o",title:"Placeholder-module__title___teBSo"}},87462:function(e,t,n){function a(){return a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},a.apply(this,arguments)}n.d(t,{Z:function(){return a}})},44925:function(e,t,n){function a(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}n.d(t,{Z:function(){return a}})}}]);