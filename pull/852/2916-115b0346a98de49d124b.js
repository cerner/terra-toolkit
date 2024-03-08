"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[2916],{55713:function(e,n,t){var o=t(24994);n.A=void 0;var a=o(t(96540)),r=o(t(5556)),s=o(t(67967)),i=o(t(25642)),l=s.default.bind(i.default),m={name:r.default.string.isRequired,src:r.default.string,url:r.default.string,version:r.default.string.isRequired},d=function(e){var n=e.src,t=e.name,o=e.url,r=e.version,s=a.default.createElement("a",{className:l("badge"),href:o||"https://www.npmjs.org/package/".concat(t,"/v/").concat(r)},a.default.createElement("span",{className:l("badge-name")},o?"package":"npm"),a.default.createElement("span",{className:l("badge-version")},"v".concat(r))),i=n?a.default.createElement("a",{className:l("badge"),href:n},a.default.createElement("span",{className:l("badge-name")},"github"),a.default.createElement("span",{className:l("badge-version")},"source")):void 0;return a.default.createElement("div",{className:l("badge-container")},s,i)};d.propTypes=m;n.A=d},2916:function(e,n,t){t.r(n),t.d(n,{default:function(){return d}});var o=t(58168),a=t(53986),r=(t(96540),t(36665)),s=t(25580),i=["components"],l={},m="wrapper";function d(e){var n=e.components,t=(0,a.A)(e,i);return(0,r.mdx)(m,(0,o.A)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,r.mdx)(s.E,{mdxType:"Badge"}),(0,r.mdx)("h1",{id:"terra-postcss-theme-plugin"},"Terra Postcss Theme plugin"),(0,r.mdx)("p",null,"The purpose of this plugin is to create a default theme from a scoped theme and to remove any known themes that are not desired."),(0,r.mdx)("p",null,"The plugin will read from the ",(0,r.mdx)("inlineCode",{parentName:"p"},"terra-theme.config.js")," at root."),(0,r.mdx)("h2",{id:"configuration"},"Configuration"),(0,r.mdx)("h3",{id:"terra-themeconfigjs"},"terra-theme.config.js"),(0,r.mdx)("p",null,"Below is an example of terra-theme.config. See ",(0,r.mdx)("a",{parentName:"p",href:"/terra-toolkit/pull/852/dev_tools/cerner-terra-toolkit-docs/webpack-config-terra/terra-theme-config-js"},"theme config")," for more details about the object structure."),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-js"},"const themeConfig = {\n  theme: 'terra-dark-theme', // The default theme.\n  scoped: ['terra-light-theme', 'terra-lowlight-theme'], // An array of scoped themes.\n};\n\nmodule.exports = themeConfig;\n")),(0,r.mdx)("h2",{id:"usage"},"Usage"),(0,r.mdx)("p",null,"To use this plugin you must have strong conventions around your theme name, include the theme class in your css and add the postcss plugin."),(0,r.mdx)("h3",{id:"css"},"CSS"),(0,r.mdx)("p",null,"This plugin makes the assumption that you are declaring theme variables under a global css class i.e. ",(0,r.mdx)("inlineCode",{parentName:"p"},".orion-fusion-theme")," and these theme files are included in such a way that they are processed by webpack."),(0,r.mdx)("p",null,"Consider the following example. The React component, ",(0,r.mdx)("inlineCode",{parentName:"p"},"Component.jsx")," pulls in and applies css styles from ",(0,r.mdx)("inlineCode",{parentName:"p"},"component.module.scss")," to the wrapper div. You will also notice it is getting the current theme set on the application from the ",(0,r.mdx)("inlineCode",{parentName:"p"},"ThemeContext")," and is also applying the current theme name to the div."),(0,r.mdx)("p",null,"If the current theme was ",(0,r.mdx)("inlineCode",{parentName:"p"},"orion-fusion-theme")," the ",(0,r.mdx)("inlineCode",{parentName:"p"},"orion-fusion-theme")," classname would be applied and the styles from ",(0,r.mdx)("inlineCode",{parentName:"p"},"component.orion-fusion-theme.module.scss")," would be applied since it is imported into ",(0,r.mdx)("inlineCode",{parentName:"p"},"component.module.scss")," and was processed by webpack."),(0,r.mdx)("h4",{id:"componentjsx"},"Component.jsx"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-jsx"},"import React from 'react';\nimport { ThemeContext } from 'terra-application/lib/theme';\n\nimport styles from './component.module.scss';\n\nconst cx = classNames.bind(styles);\n\nconst Component = ({children}) => {\n  const theme = React.useContext(ThemeContext);\n  return (\n    <div className={cx('div', theme.className)}>\n      {children}\n    </div>\n  );\n};\n\nexport default Component;\n")),(0,r.mdx)("p",null,"The scss file includes the themefile and applies the css variable to the css property. Breaking the theme variable out into their own files is purely convention and not required for this plugin. By convention we name the file ",(0,r.mdx)("inlineCode",{parentName:"p"},"<component>.<theme>.module.scss"),"."),(0,r.mdx)("h4",{id:"componentmodulescss"},"component.module.scss"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-scss"},"// Themes\n@import './component.orion-fusion-theme.module';\n\n:local {\n  .div {\n    background-color: var(--component-background-color, orange),\n  }\n}\n")),(0,r.mdx)("p",null,"The theme file declares the ",(0,r.mdx)("inlineCode",{parentName:"p"},".orion-fusion-theme")," as a global class and defines the css variable."),(0,r.mdx)("h4",{id:"componentorion-fusion-thememodulescss"},"component.orion-fusion-theme.module.scss"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-scss"},":local {\n  .orion-fusion-theme {\n    --terra-button-background-color-neutral: purple;\n  }\n}\n")),(0,r.mdx)("h3",{id:"webpack"},"Webpack"),(0,r.mdx)("p",null,"This plugin is already included in the default webpack config. Below is an example of how you could include it in your own webpack config, but we strongly recommend you extend terra's config instead of creating your own. It's intended to be included before css modules are processed."),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-js"},"const ThemePlugin = require('terra-toolkit/scripts/postcss/ThemePlugin');\n...\n  {\n    loader: 'postcss-loader',\n    options: {\n      ident: 'postcss',\n      plugins: [\n        ThemePlugin(themeConfig),\n      ],\n    },\n  },\n...\n")))}d.isMDXComponent=!0},25580:function(e,n,t){t.d(n,{E:function(){return r}});var o=t(96540),a=t(55713),r=function(e){var n=e.url;return o.createElement(a.A,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/webpack-config-terra",name:"@cerner/webpack-config-terra",version:"3.4.0",url:n})}},25642:function(e,n,t){t.r(n),n.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},58168:function(e,n,t){function o(){return o=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},o.apply(this,arguments)}t.d(n,{A:function(){return o}})},53986:function(e,n,t){function o(e,n){if(null==e)return{};var t,o,a=function(e,n){if(null==e)return{};var t,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}t.d(n,{A:function(){return o}})}}]);