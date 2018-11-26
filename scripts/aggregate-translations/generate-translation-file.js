const sortMessages = (messages) => {
  const sortedKeys = Object.keys(messages).sort((a, b) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
    if (lowerA === lowerB) {
      return 0;
    }
    return lowerA < lowerB ? -1 : 1;
  });

  const sortedMessages = {};
  sortedKeys.forEach((messageKey) => {
    sortedMessages[messageKey] = messages[messageKey];
    return undefined;
  });
  return sortedMessages;
};

const translationFile = (locale, messages) => (
  `'use strict';\n
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.locale = exports.areTranslationsLoaded = undefined;

var _reactIntl = require('react-intl');

var _${locale} = require('react-intl/locale-data/${locale}');

var _${locale}2 = _interopRequireDefault(_${locale});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactIntl.addLocaleData)(_${locale}2.default);

var messages = ${JSON.stringify(messages, null, 2)};
var areTranslationsLoaded = true;
var locale = '${locale}';
export.areTranslationsLoaded = areTranslationsLoaded;
export.locale = locale;
export.messages = messages;
`);

const generateTranslationFile = (locale, messages) => {
  const sortedMessages = sortMessages(messages);
  return translationFile(locale, sortedMessages);
};

module.exports = generateTranslationFile;
