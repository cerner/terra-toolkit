"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[277],{22863:function(e,n,t){var r=t(64836);n.Z=void 0;var a=r(t(67294)),i=r(t(45697)),l=r(t(47166)),o=r(t(17422)),s=l.default.bind(o.default),c={name:i.default.string.isRequired,src:i.default.string,url:i.default.string,version:i.default.string.isRequired},d=function(e){var n=e.src,t=e.name,r=e.url,i=e.version,l=a.default.createElement("a",{className:s("badge"),href:r||"https://www.npmjs.org/package/".concat(t,"/v/").concat(i)},a.default.createElement("span",{className:s("badge-name")},r?"package":"npm"),a.default.createElement("span",{className:s("badge-version")},"v".concat(i))),o=n?a.default.createElement("a",{className:s("badge"),href:n},a.default.createElement("span",{className:s("badge-name")},"github"),a.default.createElement("span",{className:s("badge-version")},"source")):void 0;return a.default.createElement("div",{className:s("badge-container")},l,o)};d.propTypes=c;var u=d;n.Z=u},49277:function(e,n,t){t.r(n),t.d(n,{default:function(){return d}});var r=t(87462),a=t(44925),i=(t(67294),t(81254)),l=t(79941),o=["components"],s={},c="wrapper";function d(e){var n=e.components,t=(0,a.Z)(e,o);return(0,i.mdx)(c,(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,i.mdx)(l.C,{mdxType:"Badge"}),(0,i.mdx)("h1",{id:"stylelint-config-terra-upgrade-guide"},"stylelint-config-terra Upgrade Guide"),(0,i.mdx)("h2",{id:"changes-from-stylelint-config-terra-3x--to-cernerstylelint-config-terra-400"},"Changes from stylelint-config-terra 3.x  to @cerner/stylelint-config-terra 4.0.0"),(0,i.mdx)("h3",{id:"node-10"},"Node 10"),(0,i.mdx)("p",null,"Node 10 is not the minimum supported version. Upgrade to node 10."),(0,i.mdx)("h3",{id:"stylelint-13"},"Stylelint 13"),(0,i.mdx)("p",null,"Stylelint version 13 is now required."),(0,i.mdx)("h3",{id:"cerner-scoping"},"@cerner scoping"),(0,i.mdx)("p",null,"The package is now scoped under @cerner."),(0,i.mdx)("h3",{id:"upgrading"},"Upgrading"),(0,i.mdx)("p",null,"Upgrades are confined to the consuming packages package.json file."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-diff"},'{\n  "stylelint": {\n-   "extends": "stylelint-config-terra",\n+   "extends": "@cerner/stylelint-config-terra",\n  },\n  "devDependencies": {\n+   "@cerner/stylelint-config-terra": "^4.0.0",\n-   "stylelint": "^11.0.0",\n+   "stylelint": "^13.0.0",\n-   "stylelint-config-terra": "^3.2.0",\n  }\n}\n')))}d.isMDXComponent=!0},79941:function(e,n,t){t.d(n,{C:function(){return i}});var r=t(67294),a=t(22863),i=function(e){var n=e.url;return r.createElement(a.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/stylelint-config-terra",name:"@cerner/stylelint-config-terra",version:"4.3.0",url:n})}},17422:function(e,n,t){t.r(n),n.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},87462:function(e,n,t){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},r.apply(this,arguments)}t.d(n,{Z:function(){return r}})},44925:function(e,n,t){function r(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}t.d(n,{Z:function(){return r}})}}]);