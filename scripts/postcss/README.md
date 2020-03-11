# Terra Postcss Theme plugin

The purpose of this plugin is to create a default theme from a scoped theme and to remove any known themes that are not desired.

The plugin will read from the same terra-theme.config.js

## Configuration

### terra-theme.config.js

```js
const themeConfig = {
  exclude: [], // Files to exclude. Accepts glob patterns.
  theme: 'terra-dark-theme', // The default theme.
  scoped: ['terra-light-theme', 'terra-lowlight-theme'], // An array of scoped themes.
};

module.exports = themeConfig;
```