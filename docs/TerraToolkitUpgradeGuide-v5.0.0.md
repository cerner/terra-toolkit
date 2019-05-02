# Terra Toolkit Upgrade Guide v5.0.0
This document will provide information on upgrading from terra-toolkit 4.x to 5.0.0.

## Aggregated Translations
The aggregate-translations pre-build script and default terraI18nconfiguration is no longer provided through terra-toolkit. This being said, the default webpack configuration still runs the aggegrate-translations pre-build script! Which is why `terra-aggregate-translations` is marked as a peer-depenency of terra-toolkit v5. Most project will just need to add this peer depenency and configuration via the `terraI18n.config.js` will be sufficient. For direct use of the aggregate-translations scirpt or list of supported locale, update imports to refereence the `terra-aggregate-translations` depenency: 

```diff
- const aggregateTranslations = require('terra-toolkit/scripts/aggregate-translations/aggregate-translations');
+ const aggregateTranslations = require('terra-aggregate-translations');
- const i18nSupportedLocales = require('terra-toolkit/scripts/aggregate-translations/i18nSupportedLocales');
+ const aggregateTranslations = require('terra-aggregate-translations/config/i18nSupportedLocaels');
```



