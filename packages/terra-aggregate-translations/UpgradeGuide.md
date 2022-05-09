# Terra Aggregate Translations

## Changes from version 2 to version 3

terra-aggregate-translations has drop the support of react-intl versions below 5. Projects consuming terra-aggregate-translations version 3 should use react-intl version >= 5.
React-intl V5 no longer exports the `intlShape`. Consuming project should replace the `intlShape` with `PropTypes.shape({ formatMessage: PropTypes.func })`. See [doc](https://formatjs.io/docs/intl#the-intl-object) for most complete and up to date intl shape.
Follow the upgrade guide of react-intl v5 to know more about the breaking changes : https://formatjs.io/docs/react-intl/upgrade-guide-5x 

## Changes from version 1 to version 2

### Project Name Updated with @cerner Scope

The project will need to be updated from terra-aggregate-translations to @cerner/terra-aggregate-translations in the devDependency list in package.json. Imports in the project will need to be updated from terra-aggregate-translations to @cerner/terra-aggregate-translations;

### Node 10 minimum version

@cerner/terra-aggregate-translations's minimum node version has been set to node 10. Any project using aggregate-translations will have to upgrade to node 10 at a minimum.
