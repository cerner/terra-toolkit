/*! For license information please see 5804-42c05c231d453bc41951.js.LICENSE.txt */
"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[5804],{25804:function(e,n,r){r.r(n);var i=r(85893),o=r(11151);function t(e){var n=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",a:"a",code:"code",h4:"h4",pre:"pre"},(0,o.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"terra-functional-testing---version-2-upgrade-guide",children:"Terra Functional Testing - Version 2 Upgrade Guide"}),"\n",(0,i.jsx)(n.p,{children:"The only change in this version is the upgrade to WebDriverIO v7. This should cause very little disruption to consuming projects."}),"\n",(0,i.jsx)(n.h2,{id:"breaking-changes",children:"Breaking Changes"}),"\n",(0,i.jsx)(n.h3,{id:"wdio-v6-to-v7",children:"WDIO v6 to v7"}),"\n",(0,i.jsx)(n.p,{children:"A complete list of breaking changes can be found here:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/webdriverio/webdriverio/blob/main/CHANGELOG.md#boom-breaking-change",children:"WebdriverIO v7 Breaking Changes"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://webdriver.io/docs/v7-migration",children:"WebdriverIO v6 to v7 Upgrade Guide"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["If you are using ",(0,i.jsx)(n.code,{children:"@cerner/terra-functional-testing"})," along with it's ",(0,i.jsx)(n.code,{children:"wdio.config.js"})," most of these changes should not apply."]}),"\n",(0,i.jsx)(n.h3,{id:"node-10-support-dropped",children:"Node 10 support dropped"}),"\n",(0,i.jsx)(n.p,{children:"WDIO v7 updates to fibers v5 which drops support for Node 10. Node 12 and above are recommended."}),"\n",(0,i.jsx)(n.h4,{id:"update-packagejson",children:"Update package.json"}),"\n",(0,i.jsxs)(n.p,{children:["You will need to update the ",(0,i.jsx)(n.code,{children:"@cerner/terra-functional-testing"})," version in your ",(0,i.jsx)(n.code,{children:"package.json"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-diff",children:'// package.json\n{\n  "devDependencies": {\n+   "@cerner/terra-functional-testing": "^2.0.0",\n-   "@cerner/terra-functional-testing": "^1.0.0"\n  }\n}\n'})})]})}n.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=Object.assign({},(0,o.ah)(),e.components).wrapper;return n?(0,i.jsx)(n,Object.assign({},e,{children:(0,i.jsx)(t,e)})):t(e)}},75251:function(e,n,r){var i=r(67294),o=60103;if(n.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var t=Symbol.for;o=t("react.element"),n.Fragment=t("react.fragment")}var s=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a=Object.prototype.hasOwnProperty,c={key:!0,ref:!0,__self:!0,__source:!0};function d(e,n,r){var i,t={},d=null,l=null;for(i in void 0!==r&&(d=""+r),void 0!==n.key&&(d=""+n.key),void 0!==n.ref&&(l=n.ref),n)a.call(n,i)&&!c.hasOwnProperty(i)&&(t[i]=n[i]);if(e&&e.defaultProps)for(i in n=e.defaultProps)void 0===t[i]&&(t[i]=n[i]);return{$$typeof:o,type:e,key:d,ref:l,props:t,_owner:s.current}}n.jsx=d,n.jsxs=d},85893:function(e,n,r){e.exports=r(75251)}}]);