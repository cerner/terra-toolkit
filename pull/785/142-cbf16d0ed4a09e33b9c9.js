"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[142],{17142:function(e,t,n){n.r(t),n.d(t,{default:function(){return p}});var r=n(87462),i=n(44925),s=(n(67294),n(81254)),a=["components"],o={},l="wrapper";function p(e){var t=e.components,n=(0,i.Z)(e,a);return(0,s.mdx)(l,(0,r.Z)({},o,n,{components:t,mdxType:"MDXLayout"}),(0,s.mdx)("h1",{id:"asset-server-service"},"Asset Server Service"),(0,s.mdx)("p",null,"The asset server service initializes an asset server to serve compiled assets to the testing environment. An express server will be launched for static sites. For all non-static sites a webpack-dev-server will be launched."),(0,s.mdx)("h2",{id:"options"},"Options"),(0,s.mdx)("p",null,"The assert server options are configured via the ",(0,s.mdx)("a",{parentName:"p",href:"../about#options"},"test runner CLI options"),". The webpack-dev-server will be provided the locale and theme options via the test runner and will pass those through to webpack."),(0,s.mdx)("h3",{id:"assetserverport"},"assetServerPort"),(0,s.mdx)("p",null,"The port the service will be hosted on."),(0,s.mdx)("p",null,"Type: ",(0,s.mdx)("inlineCode",{parentName:"p"},"number")),(0,s.mdx)("p",null,"Required: ",(0,s.mdx)("inlineCode",{parentName:"p"},"false")),(0,s.mdx)("p",null,"Default: ",(0,s.mdx)("inlineCode",{parentName:"p"},"8080")),(0,s.mdx)("p",null,"Example:"),(0,s.mdx)("pre",null,(0,s.mdx)("code",{parentName:"pre",className:"language-js"},'"scripts": {\n  "test:wdio": "terra wdio --assetServerPort 8081"\n}\n')),(0,s.mdx)("h3",{id:"site"},"site"),(0,s.mdx)("p",null,"A relative path to a directory of static assets. If provided, an express server will be launched to serve the directory assets."),(0,s.mdx)("p",null,"Note: The ",(0,s.mdx)("inlineCode",{parentName:"p"},"site")," configuration option will take precedence over ",(0,s.mdx)("inlineCode",{parentName:"p"},"webpackConfig")," if both are provided."),(0,s.mdx)("p",null,"Type: ",(0,s.mdx)("inlineCode",{parentName:"p"},"string")),(0,s.mdx)("p",null,"Required: ",(0,s.mdx)("inlineCode",{parentName:"p"},"false")),(0,s.mdx)("p",null,"Default: ",(0,s.mdx)("inlineCode",{parentName:"p"},"undefined")),(0,s.mdx)("p",null,"Example:"),(0,s.mdx)("pre",null,(0,s.mdx)("code",{parentName:"pre",className:"language-js"},'"scripts": {\n  "test:wdio": "terra wdio --site ./build"\n}\n')))}p.isMDXComponent=!0},87462:function(e,t,n){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},r.apply(this,arguments)}n.d(t,{Z:function(){return r}})},44925:function(e,t,n){function r(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}n.d(t,{Z:function(){return r}})}}]);