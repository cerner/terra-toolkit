"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[6853],{22863:function(e,t,n){var a=n(64836);t.Z=void 0;var r=a(n(67294)),o=a(n(45697)),i=a(n(47166)),l=a(n(17422)),d=i.default.bind(l.default),c={name:o.default.string.isRequired,src:o.default.string,url:o.default.string,version:o.default.string.isRequired},s=function(e){var t=e.src,n=e.name,a=e.url,o=e.version,i=r.default.createElement("a",{className:d("badge"),href:a||"https://www.npmjs.org/package/".concat(n,"/v/").concat(o)},r.default.createElement("span",{className:d("badge-name")},a?"package":"npm"),r.default.createElement("span",{className:d("badge-version")},"v".concat(o))),l=t?r.default.createElement("a",{className:d("badge"),href:t},r.default.createElement("span",{className:d("badge-name")},"github"),r.default.createElement("span",{className:d("badge-version")},"source")):void 0;return r.default.createElement("div",{className:d("badge-container")},i,l)};s.propTypes=c;var m=s;t.Z=m},76853:function(e,t,n){n.r(t),n.d(t,{default:function(){return s}});var a=n(87462),r=n(44925),o=(n(67294),n(81254)),i=n(60332),l=["components"],d={},c="wrapper";function s(e){var t=e.components,n=(0,r.Z)(e,l);return(0,o.mdx)(c,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.mdx)(i.C,{mdxType:"Badge"}),(0,o.mdx)("h1",{id:"terra-themeconfigjs"},"terra-theme.config.js"),(0,o.mdx)("p",null,"The terra-theme.config.js is used to define the theme for a terra-application. It can be used to specify an default theme, and any scoped themes that can be switched to. Scoped themes are not available in Internet Explorer."),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-js"},"const themeConfig = {\n  theme: 'orion-fusion-theme', // The default theme.\n  scoped: ['clinical-lowlight-theme'], // An array of scoped themes.\n};\n\nmodule.exports = themeConfig;\n")),(0,o.mdx)("h2",{id:"options"},"Options"),(0,o.mdx)("h3",{id:"theme-optional"},"Theme (Optional)"),(0,o.mdx)("p",null,"The ",(0,o.mdx)("inlineCode",{parentName:"p"},"theme")," option accepts the string name of a default theme. The default theme will be applied directly to the application."),(0,o.mdx)("h3",{id:"scoped-optional"},"Scoped (Optional)"),(0,o.mdx)("p",null,"The ",(0,o.mdx)("inlineCode",{parentName:"p"},"scoped")," option accepts an array of theme names to include in the application for theme switching."),(0,o.mdx)("h2",{id:"supported-themes"},"Supported Themes"),(0,o.mdx)("p",null,"Terra supports the following themes:"),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},"orion-fusion-theme"),(0,o.mdx)("li",{parentName:"ul"},"clinical-lowlight-theme"),(0,o.mdx)("li",{parentName:"ul"},"terra-default-theme")))}s.isMDXComponent=!0},60332:function(e,t,n){n.d(t,{C:function(){return o}});var a=n(67294),r=n(22863),o=function(e){var t=e.url;return a.createElement(r.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/webpack-config-terra",name:"@cerner/webpack-config-terra",version:"3.1.0",url:t})}},17422:function(e,t,n){n.r(t),t.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},87462:function(e,t,n){function a(){return a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},a.apply(this,arguments)}n.d(t,{Z:function(){return a}})},44925:function(e,t,n){function a(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}n.d(t,{Z:function(){return a}})}}]);