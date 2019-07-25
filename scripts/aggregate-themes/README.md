# Theme Aggregation

Terra Toolkit provides a built-in mechanism for aggregating themes.

By default, the terra-toolkit webpack configuration enables theme aggregation when it detects the presence of a `terra-theme.config.js` file.

## Getting started

Create a new file within the same directory as your webpack configuration file.

The file must be named `terra-theme.config.js`.

```
project
├── terra-theme.config.js
├── webpack.config.js
```

Within this file declare and export an object containing your theme configuration.

This configuration will be used to aggregate nested dependency themes and output a single `aggregated-themes.js` file. This file will be automatically included as an entry point within your application if you are using the webpack configuration provided by terra-toolkit.

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

## Scoped Theme Generation
Alternatively, opt-in feature exists to generate scoped themes with a specified selector. This functionality is provided for first class themes provided within components.
```txt
project
├── node_modules
│  └── terra-component
│      └── themes
│           ├── terra-dark-theme
│           │   └── root-theme.scss
│           └── terra-light-theme
│               └── root-theme.scss
└── themes
    └── terra-dark-theme
        ├── component.scss
        └── root-theme.scss
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

```js
// Alternative config to generate scope themes. Opt-in.
const generateScopeThemeConfig = {
  generateScope: true, // Opt-in flag.
  scoped: [
    { name: 'terra-light-theme', scopeSelector: 'light-theme' }, // An array of scoped theme config objects.
  ],
}

module.exports = generateScopeThemeConfig;
```

### Options

#### Exclude (Optional)

The `exclude` option accepts an array of files to exclude from being aggregated.

#### Theme (Optional)

The `theme` option accepts the string name of a default theme. The default theme will be applied directly to the application. If a `root-theme.scss` is found only that single file will be aggregated.

#### GenerateScope (Optional)

Opt-in flag. Set to true to generate scope themes with a given scope selector.

#### Scoped (Optional)

The `scoped` option accepts an array of theme names to aggregate. Only the `scoped-theme.scss` files will be aggregated.

Alternatively, if `generateScope` is set, provide an array of objects containing `name` and `scopeSelector`. This will generate a scoped file per theme. If `scopeSelector` is not provided, it defaults to `name`.

Using the [generateScopeThemeConfig](###terra-theme.config.js) example generates:

#### scoped-terra-light-theme.scss
####
```scss
.light-theme {
  @import 'themes/terra-light-theme/root-theme.scss';
}
```

#### aggregated-themes.js
```scss
import 'scoped-terra-light-theme.scss';
```