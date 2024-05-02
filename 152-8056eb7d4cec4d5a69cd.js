"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[152],{55713:function(e,a,n){var r=n(24994);a.A=void 0;var l=r(n(96540)),d=r(n(5556)),t=r(n(67967)),m=r(n(25642)),i=t.default.bind(m.default),u={name:d.default.string.isRequired,src:d.default.string,url:d.default.string,version:d.default.string.isRequired},p=function(e){var a=e.src,n=e.name,r=e.url,d=e.version,t=l.default.createElement("a",{className:i("badge"),href:r||"https://www.npmjs.org/package/".concat(n,"/v/").concat(d)},l.default.createElement("span",{className:i("badge-name")},r?"package":"npm"),l.default.createElement("span",{className:i("badge-version")},"v".concat(d))),m=a?l.default.createElement("a",{className:i("badge"),href:a},l.default.createElement("span",{className:i("badge-name")},"github"),l.default.createElement("span",{className:i("badge-version")},"source")):void 0;return l.default.createElement("div",{className:i("badge-container")},t,m)};p.propTypes=u;var o=p;a.A=o},10152:function(e,a,n){n.r(a),n.d(a,{default:function(){return c}});var r=n(58168),l=n(53986),d=(n(96540),n(36665)),t=n(25580),m=["components"],i={},u="wrapper";function p(e){var a=e.components,n=(0,l.A)(e,m);return(0,d.mdx)(u,(0,r.A)({},i,n,{components:a,mdxType:"MDXLayout"}),(0,d.mdx)("h1",{id:"changelog"},"Changelog"),(0,d.mdx)("h2",{id:"unreleased"},"Unreleased"),(0,d.mdx)("h2",{id:"400---may-1-2024"},"4.0.0 - (May 1, 2024)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Breaking Changes",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Upgraded to ",(0,d.mdx)("inlineCode",{parentName:"li"},"terra-aggregate-translations@3"),". ",(0,d.mdx)("inlineCode",{parentName:"li"},"terra-aggregate-translations@3")," now requires ",(0,d.mdx)("inlineCode",{parentName:"li"},"react-intl@5")," as a peerDependency."),(0,d.mdx)("li",{parentName:"ul"},"Dropped support for ",(0,d.mdx)("inlineCode",{parentName:"li"},"webpack@4")," and ",(0,d.mdx)("inlineCode",{parentName:"li"},"webpack-cli@3"),"."),(0,d.mdx)("li",{parentName:"ul"},"Dropped suport for Node 10 & 12. Node 14 is now the minimum required version required.")))),(0,d.mdx)("h2",{id:"340---february-27-2024"},"3.4.0 - (February 27, 2024)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Added",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Explicitly added ",(0,d.mdx)("inlineCode",{parentName:"li"},"fibers@5")," since it's a transient dependency of ",(0,d.mdx)("inlineCode",{parentName:"li"},"sass-loader@10"),".")))),(0,d.mdx)("h2",{id:"330---september-26-2023"},"3.3.0 - (September 26, 2023)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump")))),(0,d.mdx)("h2",{id:"320---august-31-2023"},"3.2.0 - (August 31, 2023)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump")))),(0,d.mdx)("h2",{id:"312---august-30-2023"},"3.1.2 - (August 30, 2023)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump")))),(0,d.mdx)("h2",{id:"311---august-25-2023"},"3.1.1 - (August 25, 2023)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Fixed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Fixed install failures by removing unnecessary ",(0,d.mdx)("inlineCode",{parentName:"li"},"postinstall")," step.")))),(0,d.mdx)("h2",{id:"310---august-24-2023"},"3.1.0 - (August 24, 2023)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump.")))),(0,d.mdx)("h2",{id:"301---august-30-2022"},"3.0.1 - (August 30, 2022)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Reverts terra-aggregate-translations to v2.")))),(0,d.mdx)("h2",{id:"300---may-12-2022"},"3.0.0 - (May 12, 2022)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Breaking",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Added devMiddleWare to support webpack-dev-server v4.")))),(0,d.mdx)("h2",{id:"240---february-11-2022"},"2.4.0 - (February 11, 2022)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Revert limiting upper Node version to 14.")))),(0,d.mdx)("h2",{id:"230---february-8-2022"},"2.3.0 - (February 8, 2022)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Updated component to support Node 14.")))),(0,d.mdx)("h2",{id:"220---september-28-2021"},"2.2.0 - (September 28, 2021)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump")))),(0,d.mdx)("h2",{id:"210---august-25-2021"},"2.1.0 - (August 25, 2021)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump")))),(0,d.mdx)("h2",{id:"200---august-13-2021"},"2.0.0 - (August 13, 2021)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Breaking",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Upgraded from ",(0,d.mdx)("inlineCode",{parentName:"li"},"node-sass")," to ",(0,d.mdx)("inlineCode",{parentName:"li"},"sass (dart-sass)"),"."),(0,d.mdx)("li",{parentName:"ul"},"Removed polyfill entries.")))),(0,d.mdx)("h2",{id:"131---january-27-2021"},"1.3.1 - (January 27, 2021)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Minor dependency version bump")))),(0,d.mdx)("h2",{id:"130---january-27-2021"},"1.3.0 - (January 27, 2021)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},(0,d.mdx)("p",{parentName:"li"},"Added"),(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Added ",(0,d.mdx)("inlineCode",{parentName:"li"},"browser")," to ",(0,d.mdx)("inlineCode",{parentName:"li"},"resolve.mainFields")," in webpack module list."))),(0,d.mdx)("li",{parentName:"ul"},(0,d.mdx)("p",{parentName:"li"},"Changed"),(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Passively consume @cerner/terra-aggregate-translations package.")))),(0,d.mdx)("h2",{id:"120---january-5-2021"},"1.2.0 - (January 5, 2021)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Added optional support for aggregate themes."),(0,d.mdx)("li",{parentName:"ul"},"Make postcss a peer dependency."),(0,d.mdx)("li",{parentName:"ul"},"Opened the node version to allow versions higher than node 10.")))),(0,d.mdx)("h2",{id:"110---december-7-2020"},"1.1.0 - (December 7, 2020)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Upgrade to postcss 8.",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"AutoPrefixer to v10"),(0,d.mdx)("li",{parentName:"ul"},"Postcss-rtl to a forked version to support postcss8"))),(0,d.mdx)("li",{parentName:"ul"},"Support webpack 5")))),(0,d.mdx)("h2",{id:"100---november-24-2020"},"1.0.0 - (November 24, 2020)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Changed",(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Updated dependencies.")))),(0,d.mdx)("h2",{id:"100-alpha1---october-20-2020"},"1.0.0-alpha.1 - (October 20, 2020)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},(0,d.mdx)("p",{parentName:"li"},"Changed"),(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Removed default source map generation in loaders for prod."))),(0,d.mdx)("li",{parentName:"ul"},(0,d.mdx)("p",{parentName:"li"},"Added"),(0,d.mdx)("ul",{parentName:"li"},(0,d.mdx)("li",{parentName:"ul"},"Added the generateLoaderSourceMaps env to re-enable source map generation for loaders on demand.")))),(0,d.mdx)("h2",{id:"100-alpha0---october-1-2020"},"1.0.0-alpha.0 - (October 1, 2020)"),(0,d.mdx)("ul",null,(0,d.mdx)("li",{parentName:"ul"},"Initial alpha release")))}p.isMDXComponent=!0;var o=["components"],s={},x="wrapper";function c(e){var a=e.components,n=(0,l.A)(e,o);return(0,d.mdx)(x,(0,r.A)({},s,n,{components:a,mdxType:"MDXLayout"}),(0,d.mdx)(t.E,{mdxType:"Badge"}),(0,d.mdx)(p,{mdxType:"ChangeLog"}))}c.isMDXComponent=!0},25580:function(e,a,n){n.d(a,{E:function(){return d}});var r=n(96540),l=n(55713),d=function(e){var a=e.url;return r.createElement(l.A,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/webpack-config-terra",name:"@cerner/webpack-config-terra",version:"4.0.0",url:a})}},25642:function(e,a,n){n.r(a),a.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},58168:function(e,a,n){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var a=1;a<arguments.length;a++){var n=arguments[a];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},r.apply(this,arguments)}n.d(a,{A:function(){return r}})},53986:function(e,a,n){function r(e,a){if(null==e)return{};var n,r,l=function(e,a){if(null==e)return{};var n={};for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){if(a.indexOf(r)>=0)continue;n[r]=e[r]}return n}(e,a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(e);for(r=0;r<d.length;r++)n=d[r],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}n.d(a,{A:function(){return r}})}}]);