"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[6340],{11416:function(e,n,a){var t=a(22411);n.c=void 0;var r=t(a(11504)),o=t(a(3268)),i=t(a(74824)),s=t(a(58112)),d=i.default.bind(s.default),c={name:o.default.string.isRequired,src:o.default.string,url:o.default.string,version:o.default.string.isRequired},l=function(e){var n=e.src,a=e.name,t=e.url,o=e.version,i=r.default.createElement("a",{className:d("badge"),href:t||"https://www.npmjs.org/package/".concat(a,"/v/").concat(o)},r.default.createElement("span",{className:d("badge-name")},t?"package":"npm"),r.default.createElement("span",{className:d("badge-version")},"v".concat(o))),s=n?r.default.createElement("a",{className:d("badge"),href:n},r.default.createElement("span",{className:d("badge-name")},"github"),r.default.createElement("span",{className:d("badge-version")},"source")):void 0;return r.default.createElement("div",{className:d("badge-container")},i,s)};l.propTypes=c;n.c=l},26340:function(e,n,a){a.r(n),a.d(n,{default:function(){return l}});var t=a(45072),r=a(52822),o=(a(11504),a(69788)),i=a(61312),s=["components"],d={},c="wrapper";function l(e){var n=e.components,a=(0,r.c)(e,s);return(0,o.mdx)(c,(0,t.c)({},d,a,{components:n,mdxType:"MDXLayout"}),(0,o.mdx)(i.k,{mdxType:"Badge"}),(0,o.mdx)("h1",{id:"package-json-lint"},"Package Json Lint"),(0,o.mdx)("p",null,"The package provide lint rules that can be used to flag problems that are present in a package.json."),(0,o.mdx)("h2",{id:"installation"},"Installation"),(0,o.mdx)("p",null,"To install the module:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-shell"},"npm install @cerner/package-json-lint --save-dev\nnpm install @cerner/package-json-lint-config-terra --save-dev\n")),(0,o.mdx)("h2",{id:"usage"},"Usage"),(0,o.mdx)("h3",{id:"packagejson"},"package.json"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},'  "package-json-lint": {\n    "extends": "./packages/package-json-lint-config-terra/package-json-lint.config.js",\n    "projectType": "devModule | module | application",\n  },\n')),(0,o.mdx)("h3",{id:"npm-script"},"npm script"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},'"lint:package-json": "npm run terra -- package-json-lint",\n')),(0,o.mdx)("h2",{id:"upgrade-guide-for-package-json-lint"},"Upgrade Guide for package-json-lint"),(0,o.mdx)("h3",{id:"upgrading-to-version-2"},"Upgrading to version 2"),(0,o.mdx)("p",null,"Package JSON Lint v2 mainly removes rules for IE10 support since it is no longer supported.\nIf you have IE10 based dependencies in your project, please upgrade or remove them.\nOtherwise, no additional action is needed to upgrade to v2."),(0,o.mdx)("h2",{id:"upgrade-guide-for-package-json-lint-config-terra"},"Upgrade Guide for package-json-lint-config-terra"),(0,o.mdx)("h3",{id:"upgrading-to-version-2-1"},"Upgrading to version 2"),(0,o.mdx)("p",null,(0,o.mdx)("inlineCode",{parentName:"p"},"package-json-lint-config-terra@2")," now requires ",(0,o.mdx)("inlineCode",{parentName:"p"},"package-json-lint@2")," as a peer dependency.\nMake sure the correct version is used to prevent any peer dependency conflicts."))}l.isMDXComponent=!0},61312:function(e,n,a){a.d(n,{k:function(){return o}});var t=a(11504),r=a(11416),o=function(e){var n=e.url;return t.createElement(r.c,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/package-json-lint",name:"@cerner/package-json-lint",version:"2.2.0",url:n})}},58112:function(e,n,a){a.r(n),n.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},45072:function(e,n,a){function t(){return t=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},t.apply(this,arguments)}a.d(n,{c:function(){return t}})},52822:function(e,n,a){function t(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}a.d(n,{c:function(){return t}})}}]);