# Terra Toolkit Upgrade Guide v5.0.0
This document will provide information on upgrading from terra-toolkit 4.x to 5.0.0.

## Aggregated Translations
The aggregate-translations pre-build script and default terraI18nconfiguration is no longer provided through terra-toolkit. This being said, the default webpack configuration still runs the aggegrate-translations pre-build script! For direct use of the aggregate-translations script or list of supported locales, update imports to reference the `terra-aggregate-translations` dependency: 

```diff
- const aggregateTranslations = require('terra-toolkit/scripts/aggregate-translations/aggregate-translations');
+ const aggregateTranslations = require('terra-aggregate-translations');
- const i18nSupportedLocales = require('terra-toolkit/scripts/aggregate-translations/i18nSupportedLocales');
+ const aggregateTranslations = require('terra-aggregate-translations/config/i18nSupportedLocaels');
```

## Nightwatch 
The nightwatch utility and peer dependencies have been removed in this toolkit release.

