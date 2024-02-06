"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[2580],{22580:function(e,t,r){r.r(t),r.d(t,{default:function(){return s}});var n=r(45072),a=r(52822),o=(r(11504),r(69788)),i=["components"],d={},l="wrapper";function s(e){var t=e.components,r=(0,a.c)(e,i);return(0,o.mdx)(l,(0,n.c)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.mdx)("h1",{id:"terra-cli"},"Terra CLI"),(0,o.mdx)("p",null,"Terra CLI is a command line builder that supports creating ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/yargs/yargs/blob/master/docs/advanced.md#commands"},"yargs commands")," via defining ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module"},"command modules"),". Currently, terra-cli searches for a ",(0,o.mdx)("inlineCode",{parentName:"p"},"terra-cli")," directory in a given dependency and assumes that all subdirectories are separate command modules defined via ",(0,o.mdx)("inlineCode",{parentName:"p"},"index.js")," files in those subdirectories."),(0,o.mdx)("h2",{id:"allow-list"},"Allow List"),(0,o.mdx)("p",null,"To limit who can create these commands, terra-cli currently uses an allow list to only search for the following dependencies:"),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},"@cerner/terra-functional-testing"),(0,o.mdx)("li",{parentName:"ul"},"@cerner/terra-open-source-scripts")),(0,o.mdx)("h2",{id:"dependency-searching"},"Dependency Searching"),(0,o.mdx)("p",null,"The search paths that terra-cli uses to search for terra-cli commands includes (constrained by the ",(0,o.mdx)("a",{parentName:"p",href:"#allow-list"},"allow list")," mentioned above):"),(0,o.mdx)("ul",null,(0,o.mdx)("li",{parentName:"ul"},"The current project's src directory"),(0,o.mdx)("li",{parentName:"ul"},"The src directory within subdirectories of the packages directory if the current project is ",(0,o.mdx)("inlineCode",{parentName:"li"},"terra-toolkit")),(0,o.mdx)("li",{parentName:"ul"},"The lib directory within subdirectories of the node_modules directory")),(0,o.mdx)("p",null,"We use the src directory in the first two cases to allow for easier local development."),(0,o.mdx)("h2",{id:"example-command"},"Example command"),(0,o.mdx)("p",null,"If you want to create a command ",(0,o.mdx)("inlineCode",{parentName:"p"},"test"),", you should add a file at ",(0,o.mdx)("inlineCode",{parentName:"p"},"src/terra-cli/test/index.js")," within a dependency in the allowlist. This file should be set up to be copied but not transpiled over to the ",(0,o.mdx)("inlineCode",{parentName:"p"},"lib")," directory. The file should contain something similar to:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-javascript"},"const test = {\n  command: 'test',\n  describe: 'Test command description',\n  builder: (yargs) => testOptionsBuilder,\n  handler: testHandler,\n};\n\nmodule.exports = test;\n")),(0,o.mdx)("p",null,"For more information on how to create these modules see the ",(0,o.mdx)("a",{parentName:"p",href:"https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module"},"yargs documentation"),"."),(0,o.mdx)("p",null,"To run this command, you would execute:"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-sh"},"terra test <options>\n")))}s.isMDXComponent=!0},45072:function(e,t,r){function n(){return n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},n.apply(this,arguments)}r.d(t,{c:function(){return n}})},52822:function(e,t,r){function n(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}r.d(t,{c:function(){return n}})}}]);