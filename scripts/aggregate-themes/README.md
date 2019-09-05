# Theme Aggregation

Terra Toolkit provides a built-in mechanism for aggregating themes.

By default, the terra-toolkit webpack configuration enables theme aggregation when it detects the presence of a `terra-theme.config.js` file.

## Getting Started - Using Existing Root and Scoped Themes

Create a new file within the same directory as your webpack configuration file.

The file must be named `terra-theme.config.js`.

```
project
├── terra-theme.config.js
├── webpack.config.js
```

Within this file declare and export an object containing your theme configuration.

This configuration will be used to aggregate nested dependency themes and output a single `aggregated-themes.js` file inside a `generatedThemes` directory. This file will be automatically included as an entry point within your application if you are using the webpack configuration provided by terra-toolkit.

Theme files must follow naming conventions to be aggregated. Theme files are expected be within a namespaced directory within a `themes` directory.

```txt
project
└── themes
    ├── terra-dark-theme
    │   ├── component.scss
    │   ├── root-theme.scss
    │   └── scoped-theme.scss
    └── terra-light-theme
        ├── component.scss
        ├── root-theme.scss
        └── scoped-theme.scss
```

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
### Options

#### Exclude (Optional)

The `exclude` option accepts an array of files to exclude from being aggregated.

#### Theme (Optional)

The `theme` option accepts the string name of a default theme. The default theme will be applied directly to the application. If a `root-theme.scss` is found only that single file will be aggregated.

#### Scoped (Optional)

The `scoped` option accepts an array of theme names to aggregate. Only the `scoped-theme.scss` files will be aggregated.

## Getting Started - Generate Root and Scoped Themes
Alternatively, if root or scope theme files do not exist, theme aggregation will generate root and scope themes.

Theme aggregation shall search for files named after the `${themeName}`, then generates a root and/or scope theme. These generated file(s) output to the `generatedThemes` directory and are imported into `aggregated-themes.js`.

```txt
project
├── node_modules
│  └── terra-component
│      └── themes
│           ├── terra-dark-theme
│           │   └── terra-dark-theme.scss
│           └── terra-light-theme
│               └── terra-light-theme.scss
└── themes
    └── terra-dark-theme
        ├── component-1.scss
        ├── component-2.scss
        └── terra-dark-theme.scss
```

## Example
`${themeName}` files should be imports or CSS custom property values encased in a `:global` scope.
### themes/terra-dark-theme/terra-dark-theme.scss
```scss
:global {
  @import 'component-1';
  @import 'component-2';
}
```

Using the above `terra-theme-config` in conjunction with the above project structure generates:

### generatedThemes/root-terra-dark-theme.scss
```scss
:root {
  @import '../node_modules/terra-component/themes/terra-dark-theme/terra-dark-theme.scss';
  @import '../themes/terra-dark-theme/terra-dark-theme.scss';
}
```

### generatedThemes/scoped-terra-light-theme.scss
```scss
.light-theme {
  @import '../node_modules/terra-component/themes/terra-light-theme/theme-variables.scss';
}
```

### generatedThemes/aggregated-themes.js
```scss
import './root-terra-dark-theme.scss';
import './scoped-terra-light-theme.scss';
```
