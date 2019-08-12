# Theme Aggregation

Terra Toolkit provides a built-in mechanism for aggregating themes.

By default, the terra-toolkit webpack configuration enables theme aggregation when it detects the presence of a `terra-theme.config.js` file.

## Use Existing Root and Scoped Themes

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

## Configuratiod

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

## Generate Root and Scoped Themes (Opt -in)
Alternatively, an opt-in feature exists to generate root and scoped themes with a specified selector, then output a single `aggregated-themes.js` file. Once activated, theme aggregation searches files following the namespace `*theme-variables`, then generates root or scoped theme files. These generated file(s) output to the `generatedThemes` directory and are imported into `aggregated-themes.js`.

**Note**, root and scope theme generation will be the default behaviour for terra-toolkit v6, eliminating the need for pre-baked root and scope files.
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

The only requirement for each theme file is an object containing custom property values.

```scss
{
  --theme-variable-one: pink;
  --theme-variable-two: purple;
}
```

## Configuration

```js
// Alternative config to generate scope themes.
const generateScopeThemeConfig = {
  exclude: [],
  generateRoot: false, // Opt-in flag.
  generateScoped: true, // Opt-in flag.
  theme: 'terra-dark-theme',
  scoped: [
    { name: 'terra-light-theme', scopeSelector: 'light-theme' }, // An array of scoped theme config objects.
  ],
}

module.exports = generateScopeThemeConfig;
```

### Opt-in Options

#### GenerateRoot (Optional)
Opt-in flag. Set to true to generate a theme under the root selector.

#### GenerateScoped (Optional)

Opt-in flag. Set to true to generate scope themes with a given scope selector.

#### Scoped (Optional)

If `generateScopedTheme` is set, the `scoped` option accepts an array of objects containing `name` and `scopeSelector`. This will generate a scoped file per object. If `scopeSelector` is not provided, it defaults to `name`.

Using the [generateScopeThemeConfig](###terra-theme.config.js) example generates:

#### generatedThemes/root-terra-dark-theme.scss
####
```scss
:global(:root) {
  @import 'themes/terra-light-theme/root-theme.scss';
}
```

#### generatedThemes/scoped-terra-light-theme.scss
####
```scss
:global(.light-theme) {
  @import 'themes/terra-light-theme/root-theme.scss';
}
```

#### generatedThemes/aggregated-themes.js
```scss
import 'scoped-terra-light-theme.scss';
```
