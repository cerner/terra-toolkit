# Terra Postcss Theme plugin

The purpose of this plugin is to create a default theme from a scoped theme and to remove any known themes that are not desired.

The plugin will read from the same `terra-theme.config.js` that `terra-aggregate-themes` script reads from. Eventually `terra-aggregate-theme`s will be deprecated in favor of this strategy.

## Configuration

### terra-theme.config.js

Below is an example of terra-theme.config. For more theme config information go [here](https://github.com/cerner/terra-toolkit-boneyard/tree/postcss-theme-plugin/config/webpack/postcss/themeConfig.md).

```js
const themeConfig = {
  theme: 'terra-dark-theme', // The default theme.
  scoped: ['terra-light-theme', 'terra-lowlight-theme'], // An array of scoped themes.
};

module.exports = themeConfig;
```

## Usage

To use this plugin you must have strong conventions around your theme name, include the theme class in your css and add the postcss plugin.

### CSS

This plugin makes the assumption that you are declaring theme variables under a global css class i.e. ```.orion-fusion-theme``` and these theme files are included in such a way that they are processed by webpack.

Consider the following example. The React component, `Component.jsx` pulls in and applies css styles from `component.module.scss` to the wrapper div. You will also notice it is getting the current theme set on the application from the `ThemeContext` and is also applying the current theme name to the div.

If the current theme was `orion-fusion-theme` the `orion-fusion-theme` classname would be applied and the styles from `component.orion-fusion-theme.module.scss` would be applied since it is imported into `component.module.scss` and was processed by webpack.

#### Component.jsx

```jsx
import React from 'react';
import { ThemeContext } from 'terra-application/lib/theme';

import styles from './component.module.scss';

const cx = classNames.bind(styles);

const Component = ({children}) => {
  const theme = React.useContext(ThemeContext);
  return (
    <div className={cx('div', theme.className)}>
      {children}
    </div>
  );
};

export default Component;
```

The scss file includes the themefile and applies the css variable to the css property. Breaking the theme variable out into their own files is purely convention and not required for this plugin. By convention we name the file ```<component>.<theme>.module.scss```.

#### component.module.scss

```scss
// Themes
@import './component.orion-fusion-theme.module';

:local {
  .div {
      background-color: var(--component-background-color, orange),
  }
}
```

The theme file declares the ```.orion-fusion-theme``` as a global class and defines the css variable.

#### component.orion-fusion-theme.module.scss

```scss
:local {
  .orion-fusion-theme {
    --terra-button-background-color-neutral: purple;
  }
}
```

### Webpack

This plugin is already included in the default webpack config. Below is an example of how you could include it in your own webpack config, but we strongly recommend you extend terra's config instead of creating your own. It's intended to be included before css modules are processed.

```js
const ThemePlugin = require('terra-toolkit/scripts/postcss/ThemePlugin');
...
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        ThemePlugin(themeConfig),
      ],
    },
  },
...
```
