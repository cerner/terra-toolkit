"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[732],{55713:function(e,a,r){var n=r(24994);a.A=void 0;var t=n(r(96540)),o=n(r(5556)),s=n(r(67967)),c=n(r(25642)),i=s.default.bind(c.default),d={name:o.default.string.isRequired,src:o.default.string,url:o.default.string,version:o.default.string.isRequired},l=function(e){var a=e.src,r=e.name,n=e.url,o=e.version,s=t.default.createElement("a",{className:i("badge"),href:n||"https://www.npmjs.org/package/".concat(r,"/v/").concat(o)},t.default.createElement("span",{className:i("badge-name")},n?"package":"npm"),t.default.createElement("span",{className:i("badge-version")},"v".concat(o))),c=a?t.default.createElement("a",{className:i("badge"),href:a},t.default.createElement("span",{className:i("badge-name")},"github"),t.default.createElement("span",{className:i("badge-version")},"source")):void 0;return t.default.createElement("div",{className:i("badge-container")},s,c)};l.propTypes=d;var p=l;a.A=p},25732:function(e,a,r){r.r(a),r.d(a,{default:function(){return l}});var n=r(58168),t=r(53986),o=(r(96540),r(36665)),s=r(25580),c=["components"],i={},d="wrapper";function l(e){var a=e.components,r=(0,t.A)(e,c);return(0,o.mdx)(d,(0,n.A)({},i,r,{components:a,mdxType:"MDXLayout"}),(0,o.mdx)(s.E,{mdxType:"Badge"}),(0,o.mdx)("h1",{id:"webpack-config-terra-upgrade-guide"},"webpack-config-terra Upgrade Guide"),(0,o.mdx)("h2",{id:"changes-from-cernerwebpack-config-terra-100-to-cernerwebpack-config-terra-200"},"Changes from @cerner/webpack-config-terra 1.0.0 to @cerner/webpack-config-terra 2.0.0"),(0,o.mdx)("h4",{id:"removed-polyfill-entrypoints"},"Removed Polyfill entrypoints"),(0,o.mdx)("p",null,"In an effort to provide more direct control to consumers we have removed the core-js and regenerator runtime polyfills from webpack-config-terra. Consumers can now decide if those polyfills are required for their sites. We now offer the ",(0,o.mdx)("a",{parentName:"p",href:"/terra-toolkit/pull/866/application/cerner-terra-application-docs/polyfills"},"terra-polyfill")," package that can be included in your application as a side effect."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"import '@cerner/terra-polyfill';\n")),(0,o.mdx)("h4",{id:"removed-node-sass"},"Removed node-sass"),(0,o.mdx)("p",null,"We have removed ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/sass/node-sass"},"node-sass")," from dependencies and switched to ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/sass/dart-sass"},"sass (dart-sass)"),"."),(0,o.mdx)("h4",{id:"update-wdio-snapshots"},"Update WDIO snapshots"),(0,o.mdx)("p",null,"The previously used ",(0,o.mdx)("inlineCode",{parentName:"p"},"node-sass")," had a precision of 5, whereas ",(0,o.mdx)("inlineCode",{parentName:"p"},"sass")," has an unadjustable precision of 10. Hence consumers may need to regenerate screenshots to account for slightly larger css values."))}l.isMDXComponent=!0},25580:function(e,a,r){r.d(a,{E:function(){return o}});var n=r(96540),t=r(55713),o=function(e){var a=e.url;return n.createElement(t.A,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/webpack-config-terra",name:"@cerner/webpack-config-terra",version:"4.0.0",url:a})}},25642:function(e,a,r){r.r(a),a.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},58168:function(e,a,r){function n(){return n=Object.assign?Object.assign.bind():function(e){for(var a=1;a<arguments.length;a++){var r=arguments[a];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},n.apply(this,arguments)}r.d(a,{A:function(){return n}})},53986:function(e,a,r){function n(e,a){if(null==e)return{};var r,n,t=function(e,a){if(null==e)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(a.indexOf(n)>=0)continue;r[n]=e[n]}return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],a.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(t[r]=e[r])}return t}r.d(a,{A:function(){return n}})}}]);