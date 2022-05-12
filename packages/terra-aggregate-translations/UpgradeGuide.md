# Terra Aggregate Translations

## Changes from version 2 to version 3

`terra-aggregate-translations v3` drops support for `react-intl 4` and below. Projects consuming `terra-aggregate-translations` version 3 should use `react-intl` version `>= 5`.

`react-intl v5` no longer exports the `intlShape`. Consuming projects should replace the `intlShape` with `PropTypes.shape()` containing the functions that are utilized by the component. See [doc](https://formatjs.io/docs/intl#the-intl-object) for most complete and up to date intl shape.

Most of the changes to react-intl api's happened in version 3 and version 4. Refer to Resources section for more information about Breaking changes happened in react-intl from version 2 to version 5.

### Resources
- Upgrade guide for version 4 -> 5 : https://formatjs.io/docs/react-intl/upgrade-guide-5x
- Upgrade guide for version 3 -> 4 : https://formatjs.io/docs/react-intl/upgrade-guide-4x
- Upgrade guide for version 2 -> 3 : https://formatjs.io/docs/react-intl/upgrade-guide-3x 

## Changes from version 1 to version 2

### Project Name Updated with @cerner Scope

The project will need to be updated from terra-aggregate-translations to @cerner/terra-aggregate-translations in the devDependency list in package.json. Imports in the project will need to be updated from terra-aggregate-translations to @cerner/terra-aggregate-translations;

### Node 10 minimum version

@cerner/terra-aggregate-translations's minimum node version has been set to node 10. Any project using aggregate-translations will have to upgrade to node 10 at a minimum.
