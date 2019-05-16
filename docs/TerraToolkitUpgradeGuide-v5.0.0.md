# Terra Toolkit Upgrade Guide v5.0.0
This document will provide information on upgrading from terra-toolkit 4.x to 6.0.0.

## Terra Scripts

### Aggregated Translations
The aggregate-translations pre-build script and default terraI18nconfiguration is no longer provided through terra-toolkit. This being said, the default webpack configuration still runs the aggegrate-translations pre-build script! For direct use of the aggregate-translations script or list of supported locales, update imports to reference the `terra-aggregate-translations` dependency: 

```diff
- const aggregateTranslations = require('terra-toolkit/scripts/aggregate-translations/aggregate-translations');
+ const aggregateTranslations = require('terra-aggregate-translations');
- const i18nSupportedLocales = require('terra-toolkit/scripts/aggregate-translations/i18nSupportedLocales');
+ const aggregateTranslations = require('terra-aggregate-translations/config/i18nSupportedLocaels');
```

### Serve

Serve is now a thin abstraction on webpack dev server and the commandline api is now identical. With this addition it now means that you have control over the dev server through options specified in your webpack config as well as through the cli.

Why use serve instead of webpack-dev-server directly? Having the serve abstraction provides a hook for us to change the servers implementation in case webpack-dev-server no longer meets our needs.

Our default webpack config has been updated with the following defaults:

```javascript
module.exports = {
  devServer: {
    // We set the host this way to allow it to be served from docker containers.
    host: '0.0.0.0',
    // These options cut down on noise in the webpack build output.
    stats: {
      colors: true,
      children: false,
    },
  },
};
```

Serve is no longer available as a javascript function. If this is needed use [webpack-dev-server](https://github.com/webpack/webpack-dev-server) directly.

### Serve Static

Webpack-dev-server now supports IE 10+, because of this change we have removed the ability for serve-static to run webpack to create your site. Serve static now will simply host static site content.

If an html page is not found serve static will try to return /404.html with a status of 404. If that file is not found serve static will return a 404 status as before.

These api options have been removed from both the cli and javascript:

* config
* production
* disk

If you want to serve a non hot-reloading site without pre-building your site, use tt-static with the following options specified in your webpack config.

```javascript
module.exports = {
  devServer: {
    // Disable hot reloading and javascript injection to watch for changes.
    hot: false,
    inline: false,
  },
};
```

### tt-heroku-serve-static

This script was removed. Use this instead:
```npm run compile:prod && tt-serve-static --port $PORT --site './build'```

## WebdriverIO
### Depenedency Changes
- unlock `axe-core`: `3.0.3` -> `^3.0.2`.

### Visual Regression
The default form factor is now 'huge' to correct inconsistent viewport sizing that had occured when a test used the default viewport for a test run vs defining a huge viewport. This may require screenshot updates, but no code changes are necessary.

### ServeStaticService

The serve static service can serve a static site or compile a site from the wepback config. The compiled site will be served by webpack-dev-server and the static site will be served by serve static.

The service will no longer inject the locale into served html files.

For static sites, the orginal files will be served, you will be responsible for adding the locale to the static files.

For compiled sites, the ```defaultLocale```` environment variable will be passed to the webpack config indicating what locale the site should be compiled for. This will be done automatically for projects using terra-dev-site.

For example:
Webpack config

```javascript
module.exports = (env = {}) => {
  const { defaultLocale = 'en' } = env;
  return {
    plugins: [
      new HtmlWebpackPlugin({
        lang: defaultLocale,
        template: 'index.html'),
        filename: './index.html',
      }),
    ],
  };
};
```

Template

```html
<!doctype html>
<html lang="<%= htmlWebpackPlugin.options.lang %>" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>index</title>
  </head>
  <body>
    <h1>index</h1>
  </body>
</html>
```

For compiled sites, the service will respect the devserver setting in webpack config with a few exceptions:

```javascript
module.exports = {
  devServer: {
    // Disable hot reloading and javascript injection to watch for changes.
    hot: false,
    inline: false,
    host: '0.0.0.0',
    // From wdio config.
    port,
    // From wdio config.
    index,
    stats: {
      colors: true,
      children: false,
    },
  },
};
```

### AxeService
The AxeService has been removed. The accessibilitly capabilites the Axe Service provided has been move to the Terra Service because the services could not run independently. The `axe` key can still be used for configuration and the test helper and axe chai assertion can be used. Please note, the `runOnly` option has been removed from Terra.should.beAccessible test helper and axe chai method and resetScroll has been enabled.

If you use the default wdio config, no changes need to be made. If using a custom wdio configuartion, be sure to remove the AxeService from the wdio config:
```diff
const {
- Axe: AxeService,
  SeleniumDocker: SeleniumDockerService,
  ServeStaticService,
  Terra: TerraService,
} = require('terra-toolkit/libwdio/services/index');

const config = {
  ...
- services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService, AxeService],
+ services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService],

  axe: {
    inject: true,
  },
}
```

Documentation can now be found [here](https://github.com/cerner/terra-toolkit/blob/master/docs/Wdio_Utility.md).

## Nightwatch 

The nightwatch utility and peer dependencies have been removed in this toolkit release. Be sure to remove the `nightwatch` dev-dependency in your project, if it exists.
