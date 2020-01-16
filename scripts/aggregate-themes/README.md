# Theme Aggregation

Terra Toolkit provides a built-in mechanism for aggregating themes.

By default, the terra-toolkit webpack configuration enables theme aggregation when it detects the presence of a `terra-theme.config.js` file.

## Getting Started - Generate Root and Scoped Themes
Create a new file within the same directory as your webpack configuration file.

The file must be named `terra-theme.config.js`.

```
project
├── terra-theme.config.js
├── webpack.config.js
```

Within this file declare and export an object containing your theme configuration.

Theme aggregation uses this configuration to search for theme files within the following directory format: `themes->theme-name->theme-name.scss`. Then, for each theme, a root and/or scope themes will be generated.

The generated file(s) output to the `generated-themes` directory and are imported into `aggregated-themes.js`. This js file will be automatically included as an entry point within your application if you are using the webpack configuration provided by terra-toolkit.

### Sample Project Structure
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
*Note*: To support previous functionality, if a project contains existing `root.scss` or `scoped.scss` theme files within namespaced theme directories, terra-toolkit will aggregate those theme files first, then generate theme files second. The CSS import order follows this pattern - existing `root.scss` or `scoped.scss` theme files are imported first, then generated theme files are subsequently imported.

In summary, because of CSS import order, generated theme files will take precedence over existing `root.scss` or `scoped.scss` theme files. Toolkit will default to theme generation on the 6.0 release. Below is an example.

```scss
import 'orion-fusion-theme/src/scss/root-theme.scss'; // Existing root theme
import './root-orion-fusion-theme.scss'; // Generated theme file. Takes precedence because it is imported after existing root theme.
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

The `theme` option accepts the string name of a default theme. The default theme will be applied directly to the application.

#### Scoped (Optional)

The `scoped` option accepts an array of theme names to generate or aggregate.

## Example
This example follows the [sample project structure](#Sample-Project-Structure) defined above.

`theme-name` files should contain imports or CSS custom property values encased in a `:global` scope.
### themes/terra-dark-theme/terra-dark-theme.scss
```scss
:global {
  @import 'component-1';
  @import 'component-2';
}
```

Using the above `terra-theme-config` in conjunction with the above project structure generates:

### generated-themes/root-terra-dark-theme.scss
```scss
:root {
  @import '../node_modules/terra-component/themes/terra-dark-theme/terra-dark-theme.scss';
  @import '../themes/terra-dark-theme/terra-dark-theme.scss';
}
```

### generated-themes/scoped-terra-light-theme.scss
```scss
.light-theme {
  @import '../node_modules/terra-component/themes/terra-light-theme/theme-variables.scss';
}
```

### generated-themes/aggregated-themes.js
```scss
import './root-terra-dark-theme.scss';
import './scoped-terra-light-theme.scss';
```
## [Legacy] Getting Started - Using Existing Root and Scoped Themes
Theme files must follow naming conventions to be aggregated - theme aggregation will search for `root` or `scope` theme files. These theme files are expected be within a namespaced directory within a `themes` directory.

Aggregated themes will be imported into a single `aggregated-themes.js` file inside a `generated-themes` directory. This file will be automatically included as an entry point within your application if you are using the webpack configuration provided by terra-toolkit.

*Note*: This functionality will be deprecated on 6.0 release.
### Sample Project Structure - Existing Themes
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
