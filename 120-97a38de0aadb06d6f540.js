/*! For license information please see 120-97a38de0aadb06d6f540.js.LICENSE.txt */
"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[120],{60120:function(e,n,r){r.r(n),r.d(n,{default:function(){return i}});var s=r(85893),a=r(11151);function o(e){var n=Object.assign({h1:"h1",p:"p",h2:"h2",code:"code",pre:"pre",em:"em",h3:"h3"},(0,a.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"custom-property-namespace",children:"custom-property-namespace"}),"\n",(0,s.jsx)(n.p,{children:"Requires custom properties defined within var functions to be prefixed with a namespace."}),"\n",(0,s.jsx)(n.h2,{id:"options",children:"Options"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"boolean"}),": ",(0,s.jsx)(n.code,{children:"true"})]}),"\n",(0,s.jsx)(n.p,{children:"By default the rule will find the nearest package.json and extract the package name."}),"\n",(0,s.jsx)(n.p,{children:"The following patterns are considered violations:"}),"\n",(0,s.jsx)(n.p,{children:"Example of the nearest package.json"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "name": "terra-example"\n}\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-css",children:"/* Is not prefixed with the namespace. */\na {  color: var(--terra-color); }\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The following patterns are ",(0,s.jsx)(n.em,{children:"not"})," considered violations:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-css",children:"/*          namespace ↓               */\na { color: var(--terra-example-color); }\n"})}),"\n",(0,s.jsx)(n.h2,{id:"optional-secondary-options",children:"Optional secondary options"}),"\n",(0,s.jsx)(n.h3,{id:"namespace",children:(0,s.jsx)(n.code,{children:"namespace"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"string"})}),"\n",(0,s.jsx)(n.p,{children:"A custom namespace. If not specified the name in the nearest package.json will be used."}),"\n",(0,s.jsx)(n.p,{children:"Example:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'[\n  true,\n  {\n    "namespace": "terra-component"\n  }\n]\n'})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-css",children:"a { color: var(--terra-component-color); }\n"})})]})}var c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=Object.assign({},(0,a.ah)(),e.components).wrapper;return n?(0,s.jsx)(n,Object.assign({},e,{children:(0,s.jsx)(o,e)})):o(e)};function t(e){return(0,s.jsx)(c,{})}var i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=Object.assign({},(0,a.ah)(),e.components).wrapper;return n?(0,s.jsx)(n,Object.assign({},e,{children:(0,s.jsx)(t,e)})):t()}},75251:function(e,n,r){var s=r(67294),a=60103;if(n.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var o=Symbol.for;a=o("react.element"),n.Fragment=o("react.fragment")}var c=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,t=Object.prototype.hasOwnProperty,i={key:!0,ref:!0,__self:!0,__source:!0};function l(e,n,r){var s,o={},l=null,p=null;for(s in void 0!==r&&(l=""+r),void 0!==n.key&&(l=""+n.key),void 0!==n.ref&&(p=n.ref),n)t.call(n,s)&&!i.hasOwnProperty(s)&&(o[s]=n[s]);if(e&&e.defaultProps)for(s in n=e.defaultProps)void 0===o[s]&&(o[s]=n[s]);return{$$typeof:a,type:e,key:l,ref:p,props:o,_owner:c.current}}n.jsx=l,n.jsxs=l},85893:function(e,n,r){e.exports=r(75251)}}]);