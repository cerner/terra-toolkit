const testRule = require('stylelint-test-rule-tape');
const { rule, ruleName, messages } = require('../custom-property-pattern.js');

testRule(rule, {
  ruleName,
  config: true,
  skipBasicChecks: true,

  accept: [
    { code: '.test { color: var(--test-example-color) }' },
    { code: '.test { background-color: var(--test-background-color) }' },
  ],

  reject: [
    {
      description: 'Should reject custom properties that include underscores',
      code: '.test { background-color: var(--test_color) }',
      message: messages.expected('--test_color'),
      line: 1,
      column: 9,
    },
    {
      description: 'Should reject custom properties that include uppercase characters',
      code: '.test { color: var(--Test-color) }',
      message: messages.expected('--Test-color'),
      line: 1,
      column: 9,
    },
  ],
});
