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
Alternatively, generate root and scoped themes, then output a single `aggregated-themes.js` file within the `generatedThemes` directory.

When activated, theme aggregation searches files following the namespace `*theme-variables`, then generates root or scoped theme files. These generated file(s) output to the `generatedThemes` directory and are imported into `aggregated-themes.js`.

```txt
project
├── node_modules
│  └── terra-component
│      └── themes
│           ├── terra-dark-theme
│           │   └── theme-variables.scss
│           └── terra-light-theme
│               └── theme-variables.scss
└── themes
    └── terra-dark-theme
        ├── component-1-theme-variables.scss
        └── component-2-theme-variables.scss
```

##### Example - theme-variables.scss
```scss
:global {
  --theme-variable-one: pink;
  --theme-variable-two: purple;
}
```

## Additional Configuration

```js
// Config to generate root and scope themes.
const generateScopeThemeConfig = {
  exclude: [],
  generateRoot: true,
  generateScoped: true,
  theme: 'terra-dark-theme',
  scoped: [
    { name: 'terra-light-theme', scopeSelector: 'light-theme' }, // An array of scoped theme config objects.
  ],
}

module.exports = generateScopeThemeConfig;
```

### Opt-in Options

#### GenerateRoot (Optional)
Set to true to generate a default theme under the root selector.

#### GenerateScoped (Optional)

Set to true to generate scope themes with a given scope selector.

#### Scoped (Optional)

If `generateScopedTheme` is set, the `scoped` option accepts an array of objects containing `name` and `scopeSelector`. This will generate a scoped file per object. `scopedSelector` defaults to `name` if `scopeSelector` is undefined.

Using the [generateScopeThemeConfig](###terra-theme.config.js) example generates:

#### generatedThemes/root-terra-dark-theme.scss
####
```scss
:root {
  @import '../node_modules/terra-component/themes/terra-dark-theme/theme-variables.scss';
  @import '../themes/terra-dark-theme/component-1-theme-variables.scss';
  @import '../themes/terra-dark-theme/component-2-theme-variables.scss';
}
```

#### generatedThemes/scoped-terra-light-theme.scss
####
```scss
.light-theme {
  @import '../node_modules/terra-component/themes/terra-light-theme/theme-variables.scss';
}
```

#### generatedThemes/aggregated-themes.js
```scss
import './root-terra-dark-theme.scss';
import './scoped-terra-light-theme.scss';
```
