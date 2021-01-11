const { Logger } = require('@cerner/terra-cli');
const dispatchCustomEvent = require('./dispatchCustomEvent');

const logger = new Logger({ prefix: '[terra-functional-testing:setLocale]' });

/**
 * Updates terra-application's locale via custom event
 * @param {string} locale - name of locale to update to
 */
const setLocale = (locale) => {
  if (typeof locale === 'undefined' || !locale) {
    logger.error(`Unsupported locale supplied to setLocale. "${locale}" is not a valid locale.`);
    return;
  }

  const event = {
    name: 'applicationBase.testOverride',
    metaData: { locale },
  };

  dispatchCustomEvent(event);
};

module.exports = setLocale;
