const testRule = require('stylelint-test-rule-tape');
const { rule, ruleName, messages } = require('../custom-property-namespace.js');

testRule(rule, {
  ruleName,
  config: true,
  skipBasicChecks: true,

  accept: [
    { code: '.test { color: var(--stylelint-config-terra-color) }' },
  ],

  reject: [
    {
      description: 'Should reject custom properties that do not include a namespace',
      code: '.test { color: var(--test-color) }',
      message: messages.expected('--test-color', 'stylelint-config-terra'),
      line: 1,
      column: 9,
    },
  ],
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      namespace: 'mock-namespace',
    }],
  skipBasicChecks: true,

  accept: [
    { code: '.test { color: var(--mock-namespace-color) }' },
  ],

  reject: [
    {
      description: 'Should reject custom properties that do not include a namespace',
      code: '.test { color: var(--test-color) }',
      message: messages.expected('--test-color', 'mock-namespace'),
      line: 1,
      column: 9,
    },
  ],
});
