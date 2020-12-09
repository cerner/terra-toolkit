const testRule = require('stylelint-test-rule-tape');
const { rule, ruleName, messages } = require('../custom-property-name.js');

testRule(rule, {
  ruleName,
  config: true,
  skipBasicChecks: true,

  accept: [
    { code: '.test { color: var(--test-color, #000) }' },
    { code: '.test { background-image: var(--test-background-image, #000) }' },
  ],

  reject: [
    {
      description: 'Should reject custom properties that are not suffixed with the style property name',
      code: '.test { background-image: var(--test-icon, #000) }',
      message: messages.expected('--test-icon', 'background-image'),
      line: 1,
      column: 9,
    },
    {
      description: 'Should reject custom properties that are not suffixed with the style property name',
      code: '.test { color: var(--test-color-primary, #000) }',
      message: messages.expected('--test-color-primary', 'color'),
      line: 1,
      column: 9,
    },
  ],
});
