/*! For license information please see 1627-db99ec60b62b978a4603.js.LICENSE.txt */
"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[1627],{91627:function(e,r,n){n.r(r);var s=n(85893),t=n(11151);function i(e){var r=Object.assign({h1:"h1",p:"p",a:"a",code:"code",h2:"h2",ul:"ul",li:"li",pre:"pre"},(0,t.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.h1,{id:"terra-cli",children:"Terra CLI"}),"\n",(0,s.jsxs)(r.p,{children:["Terra CLI is a command line builder that supports creating ",(0,s.jsx)(r.a,{href:"https://github.com/yargs/yargs/blob/master/docs/advanced.md#commands",children:"yargs commands"})," via defining ",(0,s.jsx)(r.a,{href:"https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module",children:"command modules"}),". Currently, terra-cli searches for a ",(0,s.jsx)(r.code,{children:"terra-cli"})," directory in a given dependency and assumes that all subdirectories are separate command modules defined via ",(0,s.jsx)(r.code,{children:"index.js"})," files in those subdirectories."]}),"\n",(0,s.jsx)(r.h2,{id:"allow-list",children:"Allow List"}),"\n",(0,s.jsx)(r.p,{children:"To limit who can create these commands, terra-cli currently uses an allow list to only search for the following dependencies:"}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsx)(r.li,{children:"@cerner/terra-functional-testing"}),"\n",(0,s.jsx)(r.li,{children:"@cerner/terra-open-source-scripts"}),"\n"]}),"\n",(0,s.jsx)(r.h2,{id:"dependency-searching",children:"Dependency Searching"}),"\n",(0,s.jsxs)(r.p,{children:["The search paths that terra-cli uses to search for terra-cli commands includes (constrained by the ",(0,s.jsx)(r.a,{href:"#allow-list",children:"allow list"})," mentioned above):"]}),"\n",(0,s.jsxs)(r.ul,{children:["\n",(0,s.jsx)(r.li,{children:"The current project's src directory"}),"\n",(0,s.jsxs)(r.li,{children:["The src directory within subdirectories of the packages directory if the current project is ",(0,s.jsx)(r.code,{children:"terra-toolkit"})]}),"\n",(0,s.jsx)(r.li,{children:"The lib directory within subdirectories of the node_modules directory"}),"\n"]}),"\n",(0,s.jsx)(r.p,{children:"We use the src directory in the first two cases to allow for easier local development."}),"\n",(0,s.jsx)(r.h2,{id:"example-command",children:"Example command"}),"\n",(0,s.jsxs)(r.p,{children:["If you want to create a command ",(0,s.jsx)(r.code,{children:"test"}),", you should add a file at ",(0,s.jsx)(r.code,{children:"src/terra-cli/test/index.js"})," within a dependency in the allowlist. This file should be set up to be copied but not transpiled over to the ",(0,s.jsx)(r.code,{children:"lib"})," directory. The file should contain something similar to:"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-javascript",children:"const test = {\n  command: 'test',\n  describe: 'Test command description',\n  builder: (yargs) => testOptionsBuilder,\n  handler: testHandler,\n};\n\nmodule.exports = test;\n"})}),"\n",(0,s.jsxs)(r.p,{children:["For more information on how to create these modules see the ",(0,s.jsx)(r.a,{href:"https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module",children:"yargs documentation"}),"."]}),"\n",(0,s.jsx)(r.p,{children:"To run this command, you would execute:"}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-sh",children:"terra test <options>\n"})})]})}r.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=Object.assign({},(0,t.ah)(),e.components).wrapper;return r?(0,s.jsx)(r,Object.assign({},e,{children:(0,s.jsx)(i,e)})):i(e)}},75251:function(e,r,n){var s=n(67294),t=60103;if(r.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var i=Symbol.for;t=i("react.element"),r.Fragment=i("react.fragment")}var o=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c=Object.prototype.hasOwnProperty,a={key:!0,ref:!0,__self:!0,__source:!0};function d(e,r,n){var s,i={},d=null,l=null;for(s in void 0!==n&&(d=""+n),void 0!==r.key&&(d=""+r.key),void 0!==r.ref&&(l=r.ref),r)c.call(r,s)&&!a.hasOwnProperty(s)&&(i[s]=r[s]);if(e&&e.defaultProps)for(s in r=e.defaultProps)void 0===i[s]&&(i[s]=r[s]);return{$$typeof:t,type:e,key:d,ref:l,props:i,_owner:o.current}}r.jsx=d,r.jsxs=d},85893:function(e,r,n){e.exports=n(75251)}}]);