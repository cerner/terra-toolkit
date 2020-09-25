# terra-theme.config.js

The terra-theme.config.js is used to define the theme for a terra-application. It can be used to specify an default theme, and any scoped themes that can be switched to. Scoped themes are not available in Internet Explorer.

```js
const themeConfig = {
  theme: 'terra-dark-theme', // The default theme.
  scoped: ['terra-light-theme', 'terra-lowlight-theme'], // An array of scoped themes.
};

module.exports = themeConfig;
```

## Options

### Theme (Optional)

The `theme` option accepts the string name of a default theme. The default theme will be applied directly to the application.

### Scoped (Optional)

The `scoped` option accepts an array of theme names to include in the application for theme switching.
