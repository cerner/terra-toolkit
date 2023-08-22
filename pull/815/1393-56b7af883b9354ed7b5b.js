/*! For license information please see 1393-56b7af883b9354ed7b5b.js.LICENSE.txt */
"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[1393],{40996:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=s(n(67294)),l=s(n(45697)),i=s(n(47166)),o=s(n(50026)),a=s(n(66983)),c=["children"];function s(e){return e&&e.__esModule?e:{default:e}}function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(this,arguments)}function d(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var f=i.default.bind(a.default),m=function(e){e.currentTarget.setAttribute("data-focus-styles-enabled","true")},_=function(e){e.currentTarget.setAttribute("data-focus-styles-enabled","false")},p={children:l.default.string},h=function(e){var t=e.children,n=d(e,c),l=r.default.useContext(o.default),a=(0,i.default)(f(["button",l.className]),n.className);return r.default.createElement("button",u({},n,{type:"button",className:a,onBlur:m,onMouseDown:_,"data-focus-styles-enabled":!0}),t)};h.propTypes=p;var v=h;t.default=v},59278:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=c(n(67294)),l=c(n(45697)),i=c(n(47166)),o=c(n(50026)),a=c(n(30866));function c(e){return e&&e.__esModule?e:{default:e}}var s=i.default.bind(a.default),u={ariaLevel:l.default.oneOf(["2","3","4","5","6"]),children:l.default.node,variant:l.default.oneOf(["ux-recommendation","caution","deprecation","maintenance","important","not-supported"])},d=function(e){var t=e.ariaLevel,n=e.variant,l=e.children,i=r.default.useContext(o.default);return r.default.createElement("div",{className:s("notice",n,i.className)},r.default.createElement("div",{className:s("accessory"),"aria-hidden":"true",focusable:"false"}),r.default.createElement("div",{role:"heading",className:s("title"),"aria-level":t},r.default.createElement("span",null,function(e){return"ux-recommendation"===e?"UX Recommendation":"caution"===e?"Caution":"deprecation"===e?"Deprecation Notice":"maintenance"===e?"In Maintenance":"important"===e?"Important":"not-supported"===e?"Hazards for Incorrect Usage":"error"}(n))),r.default.createElement("div",{className:s("children")},function(e){return"not-supported"===e?r.default.createElement(r.default.Fragment,null,r.default.createElement("p",{className:s("paragraph")},"This component was designed and tested according to the documented implementation."),r.default.createElement("p",{className:s("paragraph")},"Using the component incorrectly:",r.default.createElement("ul",{className:s("list")},r.default.createElement("li",null,"will likely result in improper composition and create accessibility issues"),r.default.createElement("li",null,"may cause erratic or broken behaviors and styles"),r.default.createElement("li",null,r.default.createElement("strong",null,"will not be supported "),"or enhanced to allow for incorrect use")))):null}(n),r.default.Children.map(l,(function(e){return"string"==typeof e?r.default.createElement("p",null,e):e}))))};d.propTypes=u,d.defaultProps={ariaLevel:"2",variant:"important"};var f=d;t.default=f},47306:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=u(n(67294)),l=u(n(45697)),i=u(n(94184)),o=u(n(47166)),a=u(n(50026)),c=u(n(42620)),s=["title"];function u(e){return e&&e.__esModule?e:{default:e}}function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}function f(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var m=o.default.bind(c.default),_={title:l.default.string},p=function(e){var t=e.title,n=f(e,s),l=r.default.useContext(a.default),o=(0,i.default)(m(["placeholder",l.className]),n.className),c=m(["inner"]);return r.default.createElement("div",d({},n,{className:o}),r.default.createElement("div",{className:c},r.default.createElement("p",{className:m("title")},t)))};p.propTypes=_,p.defaultProps={title:""};var h=p;t.default=h},34261:function(e,t,n){Object.defineProperty(t,"qX",{enumerable:!0,get:function(){return r.default}});var r=o(n(59278)),l=o(n(47306)),i=o(n(40996));function o(e){return e&&e.__esModule?e:{default:e}}},61393:function(e,t,n){n.r(t);var r=n(85893),l=n(11151),i=n(34261);function o(e){var t=Object.assign({h1:"h1",p:"p",a:"a",h2:"h2",h3:"h3",code:"code",pre:"pre"},(0,l.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"selenium-docker-service",children:"Selenium Docker Service"}),"\n",(0,r.jsxs)(t.p,{children:["The selenium docker service initializes a containerized ",(0,r.jsx)(t.a,{href:"https://github.com/SeleniumHQ/docker-selenium",children:"selenium docker"})," environment for running functional ",(0,r.jsx)(t.a,{href:"https://webdriver.io/",children:"WebDriverIO"})," tests."]}),"\n",(0,r.jsx)(t.p,{children:"By default, the selenium grid will be deployed locally on the host machine running on port 4444. Google Chrome and Firefox are available on the docker container. Internet Explorer can be enable when using a remote selenium grid that has it available."}),"\n",(0,r.jsx)(t.h2,{id:"options",children:"Options"}),"\n",(0,r.jsxs)(t.p,{children:["The selenium docker service options are configured via the ",(0,r.jsx)(t.a,{href:"../about#options",children:"test runner CLI options"}),"."]}),"\n",(0,r.jsx)(t.h3,{id:"disableseleniumservice",children:"disableSeleniumService"}),"\n",(0,r.jsx)(t.p,{children:"A flag to disable the selenium docker service for the test run."}),"\n",(0,r.jsxs)(t.p,{children:["Type: ",(0,r.jsx)(t.code,{children:"bool"})]}),"\n",(0,r.jsxs)(t.p,{children:["Required: ",(0,r.jsx)(t.code,{children:"false"})]}),"\n",(0,r.jsxs)(t.p,{children:["Default: ",(0,r.jsx)(t.code,{children:"false"})]}),"\n",(0,r.jsx)(t.p,{children:"Example:"}),"\n",(0,r.jsx)(i.qX,{variant:"important",ariaLevel:"3",children:(0,r.jsx)(t.p,{children:"The selenium docker service is disabled automatically by the test runner if a remote selenium grid is specified."})}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:'"scripts": {\n  "test:wdio": "terra wdio --disableSeleniumService"\n}\n'})}),"\n",(0,r.jsx)(t.h3,{id:"seleniumversion",children:"seleniumVersion"}),"\n",(0,r.jsxs)(t.p,{children:["The docker selenium image version to run tests against. This option is configured via the ",(0,r.jsx)(t.code,{children:"wdio.conf.js"}),"."]}),"\n",(0,r.jsxs)(t.p,{children:["Type: ",(0,r.jsx)(t.code,{children:"string"})]}),"\n",(0,r.jsxs)(t.p,{children:["Required: ",(0,r.jsx)(t.code,{children:"false"})]}),"\n",(0,r.jsxs)(t.p,{children:["Default: ",(0,r.jsx)(t.code,{children:"3.14.0-helium"})]}),"\n",(0,r.jsx)(t.p,{children:"Example:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"// wdio.conf.js\nconst { config } = require('@cerner/terra-functional-testing');\n\nconfig.serviceOptions = {\n  seleniumVersion: '3.141.59-20210311',\n};\n\nexports.config = config;\n"})})]})}t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},(0,l.ah)(),e.components).wrapper;return t?(0,r.jsx)(t,Object.assign({},e,{children:(0,r.jsx)(o,e)})):o(e)}},66983:function(e,t,n){n.r(t),t.default={"clinical-lowlight-theme":"Button-module__clinical-lowlight-theme___TyZWB","orion-fusion-theme":"Button-module__orion-fusion-theme___q-FcQ",button:"Button-module__button___QuCn2","is-active":"Button-module__is-active___Z8AuK"}},30866:function(e,t,n){n.r(t),t.default={"clinical-lowlight-theme":"Notice-module__clinical-lowlight-theme___aa5xV","orion-fusion-theme":"Notice-module__orion-fusion-theme___QAE-T",notice:"Notice-module__notice___GWkPA",children:"Notice-module__children___lDYsm",accessory:"Notice-module__accessory___wkLOG",title:"Notice-module__title___6H5tc","ux-recommendation":"Notice-module__ux-recommendation___N8BuK",caution:"Notice-module__caution___hPrVl",deprecation:"Notice-module__deprecation___g1drA",maintenance:"Notice-module__maintenance___kWLIZ",important:"Notice-module__important___p5DiF","not-supported":"Notice-module__not-supported___34bHd",paragraph:"Notice-module__paragraph___5h-w1",list:"Notice-module__list___M2Kxj"}},42620:function(e,t,n){n.r(t),t.default={"clinical-lowlight-theme":"Placeholder-module__clinical-lowlight-theme___Obm9K","orion-fusion-theme":"Placeholder-module__orion-fusion-theme___svHY+",placeholder:"Placeholder-module__placeholder___ZZDXd",inner:"Placeholder-module__inner___fJq9o",title:"Placeholder-module__title___teBSo"}},75251:function(e,t,n){var r=n(67294),l=60103;if(t.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var i=Symbol.for;l=i("react.element"),t.Fragment=i("react.fragment")}var o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a=Object.prototype.hasOwnProperty,c={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,n){var r,i={},s=null,u=null;for(r in void 0!==n&&(s=""+n),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(u=t.ref),t)a.call(t,r)&&!c.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===i[r]&&(i[r]=t[r]);return{$$typeof:l,type:e,key:s,ref:u,props:i,_owner:o.current}}t.jsx=s,t.jsxs=s},85893:function(e,t,n){e.exports=n(75251)}}]);