"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[541],{44541:function(e,n,r){r.r(n),r.d(n,{default:function(){return i}});var o=r(87462),t=r(44925),a=(r(67294),r(81254)),l=["components"],s={},p="wrapper";function c(e){var n=e.components,r=(0,t.Z)(e,l);return(0,a.mdx)(p,(0,o.Z)({},s,r,{components:n,mdxType:"MDXLayout"}),(0,a.mdx)("h1",{id:"custom-property-pseudo-selectors"},"custom-property-pseudo-selectors"),(0,a.mdx)("p",null,"Requires custom properties defined within var functions to include all ancestor pseudo selectors in order."),(0,a.mdx)("p",null,"Identifiers may be placed between selectors, but the selectors must appear in order."),(0,a.mdx)("h2",{id:"options"},"Options"),(0,a.mdx)("p",null,(0,a.mdx)("inlineCode",{parentName:"p"},"boolean"),": ",(0,a.mdx)("inlineCode",{parentName:"p"},"true")),(0,a.mdx)("p",null,"The following patterns are considered violations:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-css"},"a:hover {\n  /* Does not contain the hover pseudo selector */\n  color: var(--terra-example-color);\n}\n")),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-css"},"/* Wrong order                               ↓     ↓ */\na:hover:focus { color: var(--terra-example-focus-hover-color); }\n")),(0,a.mdx)("p",null,"The following patterns are ",(0,a.mdx)("em",{parentName:"p"},"not")," considered violations:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-css"},"/*                                    ↓ */\na:hover { color: var(--terra-example-hover-color); }\n")),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-css"},".one:hover {\n  .two:focus {\n    /*                               ↓         ↓ */\n    color: var(--terra-example-one-hover-two-focus-color);\n  }\n}\n")))}c.isMDXComponent=!0;var u=["components"],m={},d="wrapper";function i(e){var n=e.components,r=(0,t.Z)(e,u);return(0,a.mdx)(d,(0,o.Z)({},m,r,{components:n,mdxType:"MDXLayout"}),(0,a.mdx)(c,{mdxType:"Readme"}))}i.isMDXComponent=!0},87462:function(e,n,r){function o(){return o=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},o.apply(this,arguments)}r.d(n,{Z:function(){return o}})},44925:function(e,n,r){function o(e,n){if(null==e)return{};var r,o,t=function(e,n){if(null==e)return{};var r,o,t={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],n.indexOf(r)>=0||(t[r]=e[r]);return t}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(t[r]=e[r])}return t}r.d(n,{Z:function(){return o}})}}]);