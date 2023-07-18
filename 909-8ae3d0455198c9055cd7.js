"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[909],{22863:function(e,n,a){var t=a(64836);n.Z=void 0;var r=t(a(67294)),o=t(a(45697)),s=t(a(47166)),l=t(a(17422)),i=s.default.bind(l.default),d={name:o.default.string.isRequired,src:o.default.string,url:o.default.string,version:o.default.string.isRequired},c=function(e){var n=e.src,a=e.name,t=e.url,o=e.version,s=r.default.createElement("a",{className:i("badge"),href:t||"https://www.npmjs.org/package/".concat(a,"/v/").concat(o)},r.default.createElement("span",{className:i("badge-name")},t?"package":"npm"),r.default.createElement("span",{className:i("badge-version")},"v".concat(o))),l=n?r.default.createElement("a",{className:i("badge"),href:n},r.default.createElement("span",{className:i("badge-name")},"github"),r.default.createElement("span",{className:i("badge-version")},"source")):void 0;return r.default.createElement("div",{className:i("badge-container")},s,l)};c.propTypes=d;var u=c;n.Z=u},50909:function(e,n,a){a.r(n),a.d(n,{default:function(){return c}});var t=a(87462),r=a(44925),o=(a(67294),a(81254)),s=a(99825),l=["components"],i={},d="wrapper";function c(e){var n=e.components,a=(0,r.Z)(e,l);return(0,o.mdx)(d,(0,t.Z)({},i,a,{components:n,mdxType:"MDXLayout"}),(0,o.mdx)(s.C,{mdxType:"Badge"}),(0,o.mdx)("h1",{id:"package-json-lint"},"Package Json Lint"),(0,o.mdx)("p",null,"The package provide lint rules that can be used to flag problems that are present in a package.json."),(0,o.mdx)("h2",{id:"installation"},"Installation"),(0,o.mdx)("p",null,"To install the module:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-shell"},"npm install @cerner/package-json-lint --save-dev\nnpm install @cerner/package-json-lint-config-terra --save-dev\n")),(0,o.mdx)("h2",{id:"usage"},"Usage"),(0,o.mdx)("h3",{id:"packagejson"},"package.json"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},'  "package-json-lint": {\n    "extends": "./packages/package-json-lint-config-terra/package-json-lint.config.js",\n    "projectType": "devModule | module | application",\n  },\n')),(0,o.mdx)("h3",{id:"npm-script"},"npm script"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},'"lint:package-json": "npm run terra -- package-json-lint",\n')),(0,o.mdx)("h2",{id:"upgrade-guide"},"Upgrade Guide"),(0,o.mdx)("h3",{id:"upgrading-to-version-2"},"Upgrading to version 2"),(0,o.mdx)("p",null,"Package JSON Lint v2 mainly removes rules for IE10 support since it is no longer supported.\nIf you have IE10 based dependencies in your project, please upgrade or remove them.\nOtherwise, no additional action is needed to upgrade to v2."))}c.isMDXComponent=!0},99825:function(e,n,a){a.d(n,{C:function(){return o}});var t=a(67294),r=a(22863),o=function(e){var n=e.url;return t.createElement(r.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/package-json-lint",name:"@cerner/package-json-lint",version:"2.0.1",url:n})}},17422:function(e,n,a){a.r(n),n.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},87462:function(e,n,a){function t(){return t=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},t.apply(this,arguments)}a.d(n,{Z:function(){return t}})},44925:function(e,n,a){function t(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}a.d(n,{Z:function(){return t}})}}]);