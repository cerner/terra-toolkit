"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[719],{85719:function(e,n,a){a.r(n),a.d(n,{default:function(){return u}});var r=a(58168),t=a(53986),o=(a(96540),a(36665)),p=["components"],l={},m="wrapper";function s(e){var n=e.components,a=(0,t.A)(e,p);return(0,o.mdx)(m,(0,r.A)({},l,a,{components:n,mdxType:"MDXLayout"}),(0,o.mdx)("h1",{id:"custom-property-namespace"},"custom-property-namespace"),(0,o.mdx)("p",null,"Requires custom properties defined within var functions to be prefixed with a namespace."),(0,o.mdx)("h2",{id:"options"},"Options"),(0,o.mdx)("p",null,(0,o.mdx)("inlineCode",{parentName:"p"},"boolean"),": ",(0,o.mdx)("inlineCode",{parentName:"p"},"true")),(0,o.mdx)("p",null,"By default the rule will find the nearest package.json and extract the package name."),(0,o.mdx)("p",null,"The following patterns are considered violations:"),(0,o.mdx)("p",null,"Example of the nearest package.json"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-json"},'{\n  "name": "terra-example"\n}\n')),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-css"},"/* Is not prefixed with the namespace. */\na {  color: var(--terra-color); }\n")),(0,o.mdx)("p",null,"The following patterns are ",(0,o.mdx)("em",{parentName:"p"},"not")," considered violations:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-css"},"/*          namespace ↓               */\na { color: var(--terra-example-color); }\n")),(0,o.mdx)("h2",{id:"optional-secondary-options"},"Optional secondary options"),(0,o.mdx)("h3",{id:"namespace"},(0,o.mdx)("inlineCode",{parentName:"h3"},"namespace")),(0,o.mdx)("p",null,(0,o.mdx)("inlineCode",{parentName:"p"},"string")),(0,o.mdx)("p",null,"A custom namespace. If not specified the name in the nearest package.json will be used."),(0,o.mdx)("p",null,"Example:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-json"},'[\n  true,\n  {\n    "namespace": "terra-component"\n  }\n]\n')),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-css"},"a { color: var(--terra-component-color); }\n")))}s.isMDXComponent=!0;var c=["components"],i={},d="wrapper";function u(e){var n=e.components,a=(0,t.A)(e,c);return(0,o.mdx)(d,(0,r.A)({},i,a,{components:n,mdxType:"MDXLayout"}),(0,o.mdx)(s,{mdxType:"Readme"}))}u.isMDXComponent=!0},58168:function(e,n,a){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},r.apply(this,arguments)}a.d(n,{A:function(){return r}})},53986:function(e,n,a){function r(e,n){if(null==e)return{};var a,r,t=function(e,n){if(null==e)return{};var a={};for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){if(n.indexOf(r)>=0)continue;a[r]=e[r]}return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(t[a]=e[a])}return t}a.d(n,{A:function(){return r}})}}]);