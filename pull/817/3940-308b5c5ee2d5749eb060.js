"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[3940],{22863:function(e,t,r){var n=r(64836);t.Z=void 0;var a=n(r(67294)),s=n(r(45697)),o=n(r(47166)),l=n(r(17422)),i=o.default.bind(l.default),u={name:s.default.string.isRequired,src:s.default.string,url:s.default.string,version:s.default.string.isRequired},d=function(e){var t=e.src,r=e.name,n=e.url,s=e.version,o=a.default.createElement("a",{className:i("badge"),href:n||"https://www.npmjs.org/package/".concat(r,"/v/").concat(s)},a.default.createElement("span",{className:i("badge-name")},n?"package":"npm"),a.default.createElement("span",{className:i("badge-version")},"v".concat(s))),l=t?a.default.createElement("a",{className:i("badge"),href:t},a.default.createElement("span",{className:i("badge-name")},"github"),a.default.createElement("span",{className:i("badge-version")},"source")):void 0;return a.default.createElement("div",{className:i("badge-container")},o,l)};d.propTypes=u;var c=d;t.Z=c},43940:function(e,t,r){r.r(t),r.d(t,{default:function(){return d}});var n=r(87462),a=r(44925),s=(r(67294),r(81254)),o=r(65941),l=["components"],i={},u="wrapper";function d(e){var t=e.components,r=(0,a.Z)(e,l);return(0,s.mdx)(u,(0,n.Z)({},i,r,{components:t,mdxType:"MDXLayout"}),(0,s.mdx)(o.C,{mdxType:"Badge"}),(0,s.mdx)("h1",{id:"stylelint-config-terra"},"Stylelint Config Terra"),(0,s.mdx)("p",null,"This configuration reflects Terra's supported stylelint policy for stylesheets. It extends the  ",(0,s.mdx)("a",{parentName:"p",href:"https://github.com/bjankord/stylelint-config-sass-guidelines"},"stylelint-config-sass-guidelines")," configuration which is based on ",(0,s.mdx)("a",{parentName:"p",href:"https://sass-guidelin.es/"},"sass-guidelines"),". Additionally, this configuration utilizes the ",(0,s.mdx)("a",{parentName:"p",href:"https://github.com/ismay/stylelint-no-unsupported-browser-features"},"stylelint-no-unsupported-browser-features")," plugin to check if the styles used are supported by the local browserslist being targeted."),(0,s.mdx)("h2",{id:"what-is-stylelint"},"What is Stylelint?"),(0,s.mdx)("p",null,(0,s.mdx)("a",{parentName:"p",href:"https://stylelint.io/"},"Stylelint")," is a mighty, modern CSS linter and fixer that helps you avoid errors and enforce consistent conventions in your stylesheets."),(0,s.mdx)("h2",{id:"installation"},"Installation"),(0,s.mdx)("p",null,"Install the module"),(0,s.mdx)("pre",null,(0,s.mdx)("code",{parentName:"pre",className:"language-shell"},"$ npm install stylelint --save-dev\n$ npm install @cerner/stylelint-config-terra --save-dev\n")),(0,s.mdx)("h2",{id:"usage"},"Usage"),(0,s.mdx)("h3",{id:"packagejson"},"package.json"),(0,s.mdx)("pre",null,(0,s.mdx)("code",{parentName:"pre",className:"language-json"},'{\n  "stylelint": {\n    "extends": "@cerner/stylelint-config-terra"\n  }\n}\n')),(0,s.mdx)("h3",{id:"extending-terras-configuration"},"Extending Terra's Configuration"),(0,s.mdx)("p",null,"It is possible to specify and override the rules defined by stylelint-config-terra. Read more about it ",(0,s.mdx)("a",{parentName:"p",href:"https://stylelint.io/user-guide/configuration/#extends"},"here"),"."),(0,s.mdx)("p",null,"For example, it is possible to override the browsers specified to the no-unsupported-browser-features plugin."),(0,s.mdx)("pre",null,(0,s.mdx)("code",{parentName:"pre",className:"language-json"},'{\n  "stylelint": {\n    "extends @cerner/stylelint-config-terra",\n    "rules": {\n      "plugin/no-unsupported-browser-features": [\n        true,\n        "browsers": ["iOS >= 10"],\n        "severity": "warning",\n      ]\n    }\n  }\n}\n')),(0,s.mdx)("h2",{id:"custom-lint-rules"},"Custom Lint Rules"),(0,s.mdx)("p",null,"The following custom rules are enabled by default."),(0,s.mdx)("ul",null,(0,s.mdx)("li",{parentName:"ul"},(0,s.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/817/dev_tools/terra-toolkit-docs/stylelint-config-terra/custom-rules/custom-property-name"},"terra/custom-property-name"),": Requires custom properties to be suffixed with the css property name."),(0,s.mdx)("li",{parentName:"ul"},(0,s.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/817/dev_tools/terra-toolkit-docs/stylelint-config-terra/custom-rules/custom-property-namespace"},"terra/custom-property-namespace"),": Requires custom properties to be prefixed with a namespace."),(0,s.mdx)("li",{parentName:"ul"},(0,s.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/817/dev_tools/terra-toolkit-docs/stylelint-config-terra/custom-rules/custom-property-no-duplicate-declaration"},"terra/custom-property-no-duplication-declaration"),": Disallows a custom property to be declared more than once with a different fallback value."),(0,s.mdx)("li",{parentName:"ul"},(0,s.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/817/dev_tools/terra-toolkit-docs/stylelint-config-terra/custom-rules/custom-property-pattern"},"terra/custom-property-pattern"),": Requires custom properties to be written in lowercase alphanumeric characters and hyphens."),(0,s.mdx)("li",{parentName:"ul"},(0,s.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/817/dev_tools/terra-toolkit-docs/stylelint-config-terra/custom-rules/custom-property-pseudo-selectors"},"terra/custom-property-pseudo-selectors"),": Requires custom properties to include all ancestor pseudo selectors in order.")))}d.isMDXComponent=!0},65941:function(e,t,r){r.d(t,{C:function(){return s}});var n=r(67294),a=r(22863),s=function(e){var t=e.url;return n.createElement(a.Z,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/stylelint-config-terra",name:"@cerner/stylelint-config-terra",version:"4.4.0",url:t})}},17422:function(e,t,r){r.r(t),t.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},87462:function(e,t,r){function n(){return n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},n.apply(this,arguments)}r.d(t,{Z:function(){return n}})},44925:function(e,t,r){function n(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}r.d(t,{Z:function(){return n}})}}]);