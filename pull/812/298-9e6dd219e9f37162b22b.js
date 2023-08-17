"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[298],{22863:function(e,n,a){var r=a(64836);n.Z=void 0;var t=r(a(67294)),i=r(a(45697)),o=r(a(47166)),d=r(a(17422)),c=o.default.bind(d.default),l={name:i.default.string.isRequired,src:i.default.string,url:i.default.string,version:i.default.string.isRequired},s=function(e){var n=e.src,a=e.name,r=e.url,i=e.version,o=t.default.createElement("a",{className:c("badge"),href:r||"https://www.npmjs.org/package/".concat(a,"/v/").concat(i)},t.default.createElement("span",{className:c("badge-name")},r?"package":"npm"),t.default.createElement("span",{className:c("badge-version")},"v".concat(i))),d=n?t.default.createElement("a",{className:c("badge"),href:n},t.default.createElement("span",{className:c("badge-name")},"github"),t.default.createElement("span",{className:c("badge-version")},"source")):void 0;return t.default.createElement("div",{className:c("badge-container")},o,d)};s.propTypes=l;var u=s;n.Z=u},86298:function(e,n,a){a.r(n),a.d(n,{default:function(){return s}});var r=a(87462),t=a(44925),i=(a(67294),a(81254)),o=a(11924),d=["components"],c={},l="wrapper";function s(e){var n=e.components,a=(0,t.Z)(e,d);return(0,i.mdx)(l,(0,r.Z)({},c,a,{components:n,mdxType:"MDXLayout"}),(0,i.mdx)(o.C,{mdxType:"Badge"}),(0,i.mdx)("h1",{id:"webpack-config-terra-upgrade-guide"},"webpack-config-terra Upgrade Guide"),(0,i.mdx)("h2",{id:"changes-from-cernerwebpack-config-terra-2-to-cernerwebpack-config-terra-3"},"Changes from @cerner/webpack-config-terra 2 to @cerner/webpack-config-terra 3"),(0,i.mdx)("h3",{id:"updated-webpack-dev-server-from-version-3-to-verison-4"},"Updated Webpack-Dev-Server from version 3 to verison 4"),(0,i.mdx)("p",null,"Webpack-dev-server has been updated to the latest version 4.x. This update will fix hot reloading issue on development mode which stopped working after upgrading Webpack to verison 5."),(0,i.mdx)("h3",{id:"breaking-changes"},"Breaking Changes"),(0,i.mdx)("p",null,"Webpack-dev-server v3 will not work with webpack-config-terra  v3. The webpack-dev-server has replaced the configuration options ( listed below ) in v4, These changes will cause webpack-dev-server v3 configurations to fail with webpack-config-terra v3."),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"inline")," has been removed without replacement in webpack-dev-server v4."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"stats"),", ",(0,i.mdx)("inlineCode",{parentName:"li"},"index")," and ",(0,i.mdx)("inlineCode",{parentName:"li"},"publicPath")," has been moved to ",(0,i.mdx)("inlineCode",{parentName:"li"},"devMiddleware")," option.")),(0,i.mdx)("p",null,"Updating webpack-config-terra to v3 would require consuming projects to update webpack-dev-server to v4 in their local dependencies."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-diff"},'  "devDependencies": {\n-   "webpack-dev-server": "^3.x.x"\n+   "webpack-dev-server": "^4.7.2"\n  }\n')))}s.isMDXComponent=!0},11924:function(e,n,a){a.d(n,{C:function(){return i}});var r=a(67294),t=a(22863),i=function(e){var n=e.url;return r.createElement(t.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/webpack-config-terra",name:"@cerner/webpack-config-terra",version:"3.0.1",url:n})}},17422:function(e,n,a){a.r(n),n.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},87462:function(e,n,a){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},r.apply(this,arguments)}a.d(n,{Z:function(){return r}})},44925:function(e,n,a){function r(e,n){if(null==e)return{};var a,r,t=function(e,n){if(null==e)return{};var a,r,t={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],n.indexOf(a)>=0||(t[a]=e[a]);return t}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(t[a]=e[a])}return t}a.d(n,{Z:function(){return r}})}}]);