"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[909],{22863:function(e,a,n){var t=n(64836);a.Z=void 0;var r=t(n(67294)),l=t(n(45697)),s=t(n(47166)),o=t(n(17422)),c=s.default.bind(o.default),i={name:l.default.string.isRequired,src:l.default.string,url:l.default.string,version:l.default.string.isRequired},d=function(e){var a=e.src,n=e.name,t=e.url,l=e.version,s=r.default.createElement("a",{className:c("badge"),href:t||"https://www.npmjs.org/package/".concat(n,"/v/").concat(l)},r.default.createElement("span",{className:c("badge-name")},t?"package":"npm"),r.default.createElement("span",{className:c("badge-version")},"v".concat(l))),o=a?r.default.createElement("a",{className:c("badge"),href:a},r.default.createElement("span",{className:c("badge-name")},"github"),r.default.createElement("span",{className:c("badge-version")},"source")):void 0;return r.default.createElement("div",{className:c("badge-container")},s,o)};d.propTypes=i;var u=d;a.Z=u},50909:function(e,a,n){n.r(a),n.d(a,{default:function(){return d}});var t=n(87462),r=n(44925),l=(n(67294),n(81254)),s=n(99825),o=["components"],c={},i="wrapper";function d(e){var a=e.components,n=(0,r.Z)(e,o);return(0,l.mdx)(i,(0,t.Z)({},c,n,{components:a,mdxType:"MDXLayout"}),(0,l.mdx)(s.C,{mdxType:"Badge"}),(0,l.mdx)("h1",{id:"package-json-lint"},"Package Json Lint"),(0,l.mdx)("p",null,"The package provide lint rules that can be used to flag problems that are present in a package.json."),(0,l.mdx)("h2",{id:"installation"},"Installation"),(0,l.mdx)("p",null,"To install the module:"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-shell"},"npm install @cerner/package-json-lint --save-dev\nnpm install @cerner/package-json-lint-config-terra --save-dev\n")),(0,l.mdx)("h2",{id:"usage"},"Usage"),(0,l.mdx)("h3",{id:"packagejson"},"package.json"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},'  "package-json-lint": {\n    "extends": "./packages/package-json-lint-config-terra/package-json-lint.config.js",\n    "projectType": "devModule | module | application",\n  },\n')),(0,l.mdx)("h3",{id:"npm-script"},"npm script"),(0,l.mdx)("pre",null,(0,l.mdx)("code",{parentName:"pre",className:"language-js"},'"lint:package-json": "npm run terra -- package-json-lint",\n')))}d.isMDXComponent=!0},99825:function(e,a,n){n.d(a,{C:function(){return l}});var t=n(67294),r=n(22863),l=function(e){var a=e.url;return t.createElement(r.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/package-json-lint",name:"@cerner/package-json-lint",version:"1.5.0",url:a})}},17422:function(e,a,n){n.r(a),a.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},87462:function(e,a,n){function t(){return t=Object.assign?Object.assign.bind():function(e){for(var a=1;a<arguments.length;a++){var n=arguments[a];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},t.apply(this,arguments)}n.d(a,{Z:function(){return t}})},44925:function(e,a,n){function t(e,a){if(null==e)return{};var n,t,r=function(e,a){if(null==e)return{};var n,t,r={},l=Object.keys(e);for(t=0;t<l.length;t++)n=l[t],a.indexOf(n)>=0||(r[n]=e[n]);return r}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)n=l[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}n.d(a,{Z:function(){return t}})}}]);