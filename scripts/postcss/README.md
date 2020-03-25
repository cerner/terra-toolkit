# Terra Postcss Theme plugin

The purpose of this plugin is to create a default theme from a scoped theme and to remove any known themes that are not desired.

The plugin will read from the same terra-theme.config.js that terra-aggregate-themes script reads from. Eventually terra-aggregate-themes will be deprecated in favor of this strategy.

## Configuration

### terra-theme.config.js

Below is an example of terra-theme.config

```js
const themeConfig = {
  exclude: [], // Files to exclude. Accepts glob patterns.
  theme: 'terra-dark-theme', // The default theme.
  scoped: ['terra-light-theme', 'terra-lowlight-theme'], // An array of scoped themes.
};

module.exports = themeConfig;
```

## Usage

To use this plugin you must have strong conventions around your theme name, include the theme class in your css and add the postcss plugin.

### CSS

This plugin makes the assumption that you are declaring theme variables under a global css class i.e. ```.orion-fusion-theme``` and these theme files are included in such a way that they are processed by webpack.

Consider the following component. The react component pulls in and applies the css styles to div.

Component.jsx

```jsx
import React from 'react';
import styles from './component.module.scss';

const cx = classNames.bind(styles);

const Component = ({children}) => (
  <div className={cx(['div'])}>
    {children}
  </div>
);

export default Component;
```

The scss file includes the themefile and applies the css variable to the css property. Breaking the theme variable out into their own files is purely convention and not required for this plugin. By convention we name the file ```<component>.<theme>.module.scss```.

#### component.module.scss

```scss
// Themes
@import './Button.orion-fusion-theme.module';

:local {
  .div {
      background-color: var(--component-background-color, orange),
  }
}
```

The theme file declares the ```.orion-fusion-theme``` as a global class and defines the css variable.

#### component.orion-fusion-theme.module.scss

```scss
:global {
  .orion-fusion-theme {
    --terra-button-background-color-neutral: purple;
  }
```

### Webpack

This plugin is already included in the default webpack config. Below is an example of how you could include it in  your own webpack config, but we strongly recommend you extend terra's config instead of creating your own.

```js
const ThemePlugin = require('terra-toolkit/scripts/postcss/ThemePlugin');
...
  new PostCSSAssetsPlugin({
    plugins: [
      ThemePlugin(<optional-override-config>),
    ],
...
```
