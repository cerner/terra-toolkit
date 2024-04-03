"use strict";(self.webpackChunkterra_toolkit=self.webpackChunkterra_toolkit||[]).push([[3025],{55713:function(e,a,t){var n=t(24994);a.A=void 0;var r=n(t(96540)),i=n(t(5556)),l=n(t(67967)),d=n(t(25642)),m=l.default.bind(d.default),o={name:i.default.string.isRequired,src:i.default.string,url:i.default.string,version:i.default.string.isRequired},p=function(e){var a=e.src,t=e.name,n=e.url,i=e.version,l=r.default.createElement("a",{className:m("badge"),href:n||"https://www.npmjs.org/package/".concat(t,"/v/").concat(i)},r.default.createElement("span",{className:m("badge-name")},n?"package":"npm"),r.default.createElement("span",{className:m("badge-version")},"v".concat(i))),d=a?r.default.createElement("a",{className:m("badge"),href:a},r.default.createElement("span",{className:m("badge-name")},"github"),r.default.createElement("span",{className:m("badge-version")},"source")):void 0;return r.default.createElement("div",{className:m("badge-container")},l,d)};p.propTypes=o;a.A=p},33025:function(e,a,t){t.r(a),t.d(a,{default:function(){return p}});var n=t(58168),r=t(53986),i=(t(96540),t(36665)),l=t(25580),d=["components"],m={},o="wrapper";function p(e){var a=e.components,t=(0,r.A)(e,d);return(0,i.mdx)(o,(0,n.A)({},m,t,{components:a,mdxType:"MDXLayout"}),(0,i.mdx)(l.E,{mdxType:"Badge"}),(0,i.mdx)("h1",{id:"webpack-config-terra"},"Webpack Config Terra"),(0,i.mdx)("p",null,"The webpack-config-terra package contains the base webpack config required to build terra applications. ",(0,i.mdx)("a",{parentName:"p",href:"https://webpack.js.org/"},"Webpack")," is a module bundler used to compile modules with dependencies and generate static assets. Webpack is a very powerful tool that is highly configurable and Terra components rely on specific polyfills, webpack loaders and plugins to render correctly."),(0,i.mdx)("h2",{id:"terras-configuration-requirements"},"Terra's Configuration Requirements"),(0,i.mdx)("p",null,"Below is the list of polyfills, webpack loaders and plugins Terra components rely on:"),(0,i.mdx)("h3",{id:"javascript-loaders"},"JavaScript Loaders"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/loaders/babel-loader/"},"babel-loader")," - Allows transpiling JavaScript files using ",(0,i.mdx)("a",{parentName:"li",href:"https://github.com/babel/babel"},"Babel")," and webpack."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/loaders/file-loader/"},"file-loader")," - Instructs webpack to emit the required object as file and to return its public URL.")),(0,i.mdx)("h3",{id:"javascript-plugins"},"JavaScript Plugins"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/plugins/define-plugin/"},"DefinePlugin")," - Plugin to define global compile-time values, including:",(0,i.mdx)("ul",{parentName:"li"},(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"CERNER_BUILD_TIMESTAMP")," - The time that webpack was executed in ISO8601 format."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"TERRA_AGGREGATED_LOCALES")," - The list of successfully aggregated locales available to the browser. See ",(0,i.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/857/dev_tools/terra-toolkit-docs/webpack-config-terra/terra-i-18-n-config-js"},"i18n config")," for more details about the object structure."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"TERRA_THEME_CONFIG")," - The scoped and default theme. See ",(0,i.mdx)("a",{parentName:"li",href:"/terra-toolkit/pull/857/dev_tools/terra-toolkit-docs/webpack-config-terra/terra-theme-config-js"},"theme config")," for more details about the object structure.")))),(0,i.mdx)("h3",{id:"css-loaders-and-plugins"},"CSS Loaders and Plugins"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://github.com/postcss/autoprefixer"},"autoprefixer")," - Plugin to parse CSS and add vendor prefixes to CSS rules. This should be configured with ",(0,i.mdx)("a",{parentName:"li",href:"https://github.com/cerner/browserslist-config-terra"},(0,i.mdx)("inlineCode",{parentName:"a"},"browserslist-config-terra")),". ","*"),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/loaders/css-loader/"},"css-loader")," - The css-loader interprets ",(0,i.mdx)("inlineCode",{parentName:"li"},"@import")," and ",(0,i.mdx)("inlineCode",{parentName:"li"},"url()")," like ",(0,i.mdx)("inlineCode",{parentName:"li"},"import/require()")," and will resolve them. The css-loader is also used to parse CSS Modules."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://github.com/webpack-contrib/mini-css-extract-plugin"},"mini-css-extract-plugin")," - This plugin extracts CSS into separate files and supports on-demand-loading of CSS and SourceMaps."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/loaders/postcss-loader/"},"postcss-loader")," - Transforms styles with JS plugins."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://github.com/klimashkin/postcss-assets-webpack-plugin#apply-postcss-plugins-to-webpack-css-asset"},"postcss-assets-webpack-plugin")," - Gets the css, extracted by ExtractTextPlugin and apply postcss plugins to it."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://github.com/postcss/postcss-custom-properties"},"postcss-custom-properties")," - Transforms W3C CSS Custom Properties to static values.","*"),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://github.com/vkalinichev/postcss-rtl"},"postcss-rtl")," - PostCSS-plugin for RTL-adaptivity."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/loaders/sass-loader/"},"sass-loader")," - Loads a SASS/SCSS file and compiles it to CSS."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/loaders/style-loader/"},"style-loader")," - Adds CSS to the DOM by injecting a ",(0,i.mdx)("inlineCode",{parentName:"li"},"<style>")," tag.")),(0,i.mdx)("h3",{id:"production-only-plugins"},"Production Only Plugins"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://github.com/johnagan/clean-webpack-plugin"},"clean-webpack-plugin")," -\nA webpack plugin to remove/clean your build folder(s) before building."),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("a",{parentName:"li",href:"https://webpack.js.org/plugins/terser-webpack-plugin/"},"terser-webpack-plugin")," - minifies your JavaScript.")),(0,i.mdx)("p",null,(0,i.mdx)("em",{parentName:"p"},"*"," Required to support IE legacy browsers")),(0,i.mdx)("h2",{id:"configuring-webpack"},"Configuring Webpack"),(0,i.mdx)("p",null,"Terra-toolkit's ",(0,i.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-toolkit/blob/main/packages/webpack-config-terra/src/webpack.config.js"},"default webpack configuration"),"."),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},"Use when building a standalone site."),(0,i.mdx)("li",{parentName:"ul"},"Additional configuration required."),(0,i.mdx)("li",{parentName:"ul"},"Can be extended with terra-dev-site plugins.")),(0,i.mdx)("p",null,"By using this default configuration, we will manage webpack dependencies and set up translation aggregation. If you choose not to use the default configuration, Toolkit's configuration can  be extend to meet your needs or it can be used as an guide to build your own."),(0,i.mdx)("h3",{id:"api"},"API"),(0,i.mdx)("p",null,"There are several different ways to customize terra's webpack config without overriding it."),(0,i.mdx)("h4",{id:"webpack-env"},"webpack env"),(0,i.mdx)("p",null,"Webpack environment options can be set via the command line. For example:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-bash"},"webpack --env.disableHotReloading=true\n")),(0,i.mdx)("p",null,"Read more on webpack's doc site about ",(0,i.mdx)("a",{parentName:"p",href:"https://webpack.js.org/api/cli/#environment-options"},"webpack environment options")),(0,i.mdx)("table",null,(0,i.mdx)("thead",{parentName:"table"},(0,i.mdx)("tr",{parentName:"thead"},(0,i.mdx)("th",{parentName:"tr",align:null},"name"),(0,i.mdx)("th",{parentName:"tr",align:null},"Type"),(0,i.mdx)("th",{parentName:"tr",align:null},"Default"),(0,i.mdx)("th",{parentName:"tr",align:null},"Description"))),(0,i.mdx)("tbody",{parentName:"table"},(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"disableAggregateTranslations")),(0,i.mdx)("td",{parentName:"tr",align:null},"Bool"),(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"false")),(0,i.mdx)("td",{parentName:"tr",align:null},"Disable the aggregate translations feature.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"disableHotReloading")),(0,i.mdx)("td",{parentName:"tr",align:null},"Bool"),(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"false")),(0,i.mdx)("td",{parentName:"tr",align:null},"Disable hot reloading, this is generally used by CI.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"disableCSSCustomProperties")),(0,i.mdx)("td",{parentName:"tr",align:null},"Bool"),(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"false")),(0,i.mdx)("td",{parentName:"tr",align:null},"A webpack environment variable ",(0,i.mdx)("inlineCode",{parentName:"td"},"disableCSSCustomProperties")," to disable css custom properties.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"defaultTheme")),(0,i.mdx)("td",{parentName:"tr",align:null},"string"),(0,i.mdx)("td",{parentName:"tr",align:null},"none"),(0,i.mdx)("td",{parentName:"tr",align:null},"Override the default theme set in the terra-theme.config.js file. Useful for testing.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"generateLoaderSourceMaps")),(0,i.mdx)("td",{parentName:"tr",align:null},"Bool"),(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"true")," for dev ",(0,i.mdx)("inlineCode",{parentName:"td"},"false")," for prod"),(0,i.mdx)("td",{parentName:"tr",align:null},"Used to enable source map generation for prod. This should be used in conjunction with setting the ",(0,i.mdx)("inlineCode",{parentName:"td"},"devtool")," webpack option. Caution, This may have a large performance impact, especially with large bundles.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"enableAggregateThemes")),(0,i.mdx)("td",{parentName:"tr",align:null},"Bool"),(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"false")),(0,i.mdx)("td",{parentName:"tr",align:null},"Enable theme aggregation.")))),(0,i.mdx)("h4",{id:"options"},"options"),(0,i.mdx)("p",null,"Options can be supplied to the terra webpack config as the third parameter after ",(0,i.mdx)("inlineCode",{parentName:"p"},"env")," and ",(0,i.mdx)("inlineCode",{parentName:"p"},"argv"),". For example:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-js"},"const webpackConfig = require('webpack-config-terra');\n\nconst themeConfig = {\n  theme: 'terra-dark-theme',\n};\n\nmodule.exports = webpackConfig({}, {}, {themeConfig});\n")),(0,i.mdx)("table",null,(0,i.mdx)("thead",{parentName:"table"},(0,i.mdx)("tr",{parentName:"thead"},(0,i.mdx)("th",{parentName:"tr",align:null},"name"),(0,i.mdx)("th",{parentName:"tr",align:null},"Type"),(0,i.mdx)("th",{parentName:"tr",align:null},"Description"))),(0,i.mdx)("tbody",{parentName:"table"},(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"themeConfig")),(0,i.mdx)("td",{parentName:"tr",align:null},"object"),(0,i.mdx)("td",{parentName:"tr",align:null},"Override terra-theme.config.js values. Useful when building multiple sites from one webpack config.")))),(0,i.mdx)("h3",{id:"extending-the-default-config"},"Extending the Default Config"),(0,i.mdx)("ol",null,(0,i.mdx)("li",{parentName:"ol"},"Create a ",(0,i.mdx)("inlineCode",{parentName:"li"},"webpack.config.js")," file."),(0,i.mdx)("li",{parentName:"ol"},"Import terra-toolkit's webpack configuration."),(0,i.mdx)("li",{parentName:"ol"},"Create an app-level webpack configuration which, at a minimum, supplies an entry and an ",(0,i.mdx)("a",{parentName:"li",href:"https://github.com/jantimon/html-webpack-plugin"},"HtmlWebpackPlugin")," entry (version ^3.2.0 or higher)."),(0,i.mdx)("li",{parentName:"ol"},"Use ",(0,i.mdx)("a",{parentName:"li",href:"https://github.com/survivejs/webpack-merge"},(0,i.mdx)("inlineCode",{parentName:"a"},"webpack-merge"))," to combine the app config with terra-toolkit's default config. Note: since the default config is an function, it will need to be executed first.")),(0,i.mdx)("p",null,"Here is an example app-level webpack configuration:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-javascript"},"const path = require('path');\nconst HtmlWebpackPlugin = require('html-webpack-plugin');\nconst { merge } = require('webpack-merge');\n\n// Import the terra-toolkit configuration.\nconst defaultWebpackConfig = require('@cerner/webpack-config-terra');\n\n// Create the app-level configuration\nconst appWebpackConfig = () => ({\n  entry: {\n    index: path.resolve(path.join(__dirname, 'lib', 'site', 'Index')),\n  },\n  plugins: [\n      new HtmlWebpackPlugin({\n        title: 'My App',\n        template: path.join(__dirname, 'lib', 'index.html'),\n      }),\n    ],\n});\n\n// combine the configurations using webpack-merge\nconst mergedConfig = (env, argv) => (\n  merge(defaultWebpackConfig(env, argv), appWebpackConfig(env, argv))\n);\n\nmodule.exports = mergedConfig;\n")),(0,i.mdx)("h4",{id:"translation-aggregation"},"Translation Aggregation"),(0,i.mdx)("p",null,"Terra's supported locales will be aggregated when using the default webpack configuration through the ",(0,i.mdx)("inlineCode",{parentName:"p"},"aggregate-translations")," pre-build tool. To customize which translations are aggregated, refer these docs on ",(0,i.mdx)("a",{parentName:"p",href:"https://github.com/cerner/terra-aggregate-translations#terrai18nconfig-example"},"aggregating translations"),". Alternatively, if translations are not required, disable translation aggregation within the webpack build by passing the environment variable ",(0,i.mdx)("inlineCode",{parentName:"p"},"--env.disableAggregateTranslations")," to the webpack command."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-bash"},"webpack --env.disableAggregateTranslations\n")),(0,i.mdx)("h3",{id:"theme-aggregation"},"Theme Aggregation"),(0,i.mdx)("p",null,"Theme aggregation supports legacy versions of components built before terra transitioned to using the theme-context to apply the current theme to components. Theme Aggregation is turned off by default and enabling it will significantly reduce webpack performance."),(0,i.mdx)("p",null,"Minimum terra component versions that support theme context as of 12/8/2020. Any components not listed here either do not have themeable variables, do not support the theme context and should be replaced, or have been introduced since this list was generated and support the theme context."),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-abstract-modal@3.25.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"@cerner/terra-docs@1.0.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-action-footer@2.42.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-action-header@2.43.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-alert@4.29.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-application-header-layout@3.28.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-application-links@6.34.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-application-name@3.30.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-application-navigation@1.37.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-application-utility@2.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-application@1.19.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-avatar@3.3.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-badge@3.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-brand-footer@2.24.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-button-group@3.39.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-button@3.36.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-card@3.27.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-cell-grid@1.5.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-data-grid@2.25.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-detail-view@3.20.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-header@3.16.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-item-display@3.18.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-item-view@3.19.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-label-value-view@3.20.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-clinical-onset-picker@4.21.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-collapsible-menu-view@6.34.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-date-input@1.14.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-date-picker@4.38.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-date-time-picker@4.38.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-demographics-banner@3.37.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-dialog-modal@3.38.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-dialog@2.42.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-divider@3.27.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-dropdown-button@1.14.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-checkbox@4.3.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-field@4.3.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-fieldset@2.42.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-input@3.5.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-radio@4.5.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-select@6.6.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-form-textarea@4.5.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-grid@6.21.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-html-table@1.6.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-hyperlink@2.34.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-icon@3.32.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-image@3.28.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-layout@4.24.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-list@4.31.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-menu@6.34.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-modal-manager@6.34.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-navigation-side-menu@2.31.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-notification-dialog@3.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-overlay@3.49.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-paginator@2.51.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-popup@6.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-profile-image@3.30.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-progress-bar@4.23.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-search-field@3.51.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-section-header@2.37.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-show-hide@2.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-signature@2.30.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-slide-group@4.21.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-slide-panel@3.27.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-spacer@3.40.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-status-view@4.27.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-switch@1.0.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-table@4.8.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-tabs@6.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-tag@2.35.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-text@4.31.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-time-input@4.29.0")),(0,i.mdx)("li",{parentName:"ul"},(0,i.mdx)("inlineCode",{parentName:"li"},"terra-toolbar@1.8.0"))),(0,i.mdx)("h4",{id:"hot-reloading-with-webpack-dev-server"},"Hot Reloading with Webpack Dev Server"),(0,i.mdx)("p",null,"Terra's webpack configuration enables hot reloading by default in development mode. Disable this behavior by passing ",(0,i.mdx)("inlineCode",{parentName:"p"},"--env.disableHotReloading")," to the cli when running webpack. This is useful to generate the production assets used during testing."),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-bash"},"webpack --env.disableHotReloading\n")),(0,i.mdx)("h4",{id:"development-vs-production"},"Development vs Production"),(0,i.mdx)("p",null,"The default webpack configuration is a function that will flex between production and development modes when passing the ",(0,i.mdx)("inlineCode",{parentName:"p"},"-p")," flag while compiling with webpack. See webpack's documentation on ",(0,i.mdx)("a",{parentName:"p",href:"https://webpack.js.org/configuration/configuration-types/"},"configuration types")," for more information."),(0,i.mdx)("h4",{id:"duplicate-asset-management"},"Duplicate Asset Management"),(0,i.mdx)("p",null,"The ",(0,i.mdx)("inlineCode",{parentName:"p"},"@cerner/duplicate-package-checker-webpack-plugin")," is used to detect duplicated packages within a generated Webpack bundle. If more than one version of the same package are present in a bundle, the package information will be logged with a Webpack compilation warning."),(0,i.mdx)("p",null,"Some packages can be duplicated safely, so these warnings may not indicate a serious problem. However, some packages are intended to be used as singleton packages. If these singleton packages are duplicated, errors will be logged and the Webpack compilation will fail."),(0,i.mdx)("table",null,(0,i.mdx)("thead",{parentName:"table"},(0,i.mdx)("tr",{parentName:"thead"},(0,i.mdx)("th",{parentName:"tr",align:null},"Package Name"),(0,i.mdx)("th",{parentName:"tr",align:null},"Description"))),(0,i.mdx)("tbody",{parentName:"table"},(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"react")),(0,i.mdx)("td",{parentName:"tr",align:null},"Has undefined behavior when multiple versions are loaded at the same time.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"react-dom")),(0,i.mdx)("td",{parentName:"tr",align:null},"Has undefined behavior when multiple versions are loaded at the same time.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"react-intl")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses React Context for communication of intl APIs.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"react-on-rails")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses a singleton registry to manage available components.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"terra-breakpoints")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses React Context for communication of active breakpoint APIs.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"terra-application")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses a number of Context-providing components.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"terra-disclosure-manager")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses React Context for communication of progressive disclosure APIs.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"terra-navigation-prompt")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses React Context for communication of navigation prompt APIs.")),(0,i.mdx)("tr",{parentName:"tbody"},(0,i.mdx)("td",{parentName:"tr",align:null},(0,i.mdx)("inlineCode",{parentName:"td"},"terra-theme-context")),(0,i.mdx)("td",{parentName:"tr",align:null},"Uses React Context to provide the current active theme name and class.")))),(0,i.mdx)("p",null,"If duplicates of the above packages are detected, options for remediation include:"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},"Updating the dependencies that are causing the duplication. Generally, the above packages should be listed as peerDependencies to prevent duplication."),(0,i.mdx)("li",{parentName:"ul"},"Adding a webpack ",(0,i.mdx)("inlineCode",{parentName:"li"},"resolve.alias")," to the configuration that will force Webpack to use a single version of the duplicated package. However, this may cause logic to fail if the APIs between the expected versions differ.")),(0,i.mdx)("h4",{id:"disabling-css-custom-properties"},"Disabling CSS Custom Properties"),(0,i.mdx)("p",null,"Certain browsers do not support ",(0,i.mdx)("a",{parentName:"p",href:"https://caniuse.com/css-variables"},"CSS custom properties"),". If you have a scenario where you are going to need to be in one of those browsers and you only have one supported theme, you can run the following to disable CSS custom properties:"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-bash"},"webpack --env.disableCSSCustomProperties\n")),(0,i.mdx)("p",null,"This will shrink the size of css and ensure that the appropriate CSS properties are defined appropriately without using CSS custom properties."))}p.isMDXComponent=!0},25580:function(e,a,t){t.d(a,{E:function(){return i}});var n=t(96540),r=t(55713),i=function(e){var a=e.url;return n.createElement(r.A,{src:"https://github.com/cerner/terra-toolk/tree/main/packages/webpack-config-terra",name:"@cerner/webpack-config-terra",version:"3.4.0",url:a})}},25642:function(e,a,t){t.r(a),a.default={badge:"Badges-module__badge___vex-+","badge-container":"Badges-module__badge-container___B13Mv","badge-name":"Badges-module__badge-name___jkN0m","badge-version":"Badges-module__badge-version___agZ+P"}},58168:function(e,a,t){function n(){return n=Object.assign?Object.assign.bind():function(e){for(var a=1;a<arguments.length;a++){var t=arguments[a];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},n.apply(this,arguments)}t.d(a,{A:function(){return n}})},53986:function(e,a,t){function n(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}t.d(a,{A:function(){return n}})}}]);