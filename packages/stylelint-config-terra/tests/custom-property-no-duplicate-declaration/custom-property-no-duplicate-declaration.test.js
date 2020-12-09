const testRule = require('stylelint-test-rule-tape');
const { rule, ruleName, messages } = require('../custom-property-no-duplicate-declaration.js');

testRule(rule, {
  ruleName,
  config: true,
  skipBasicChecks: true,

  accept: [
    { code: 'a { color: var(--test-color, #000); }' },
    { code: 'a { color: var(--test-color, #000); } .anchor { color: var(--test-color, #000); }' },
  ],

  reject: [
    {
      description: 'Should reject custom properties that do not match a previous declaration',
      code: 'a { color: var(--test-color, #000); } .anchor { color: var(--test-color, #111); }',
      message: messages.expected('--test-color', '#000'),
      line: 1,
      column: 49,
    },
    {
      description: 'Should reject custom properties that do not match a previous declaration',
      code: '.anchor { color: var(--test-color, #111); } a { color: var(--test-color, #000); }',
      message: messages.expected('--test-color', '#000'),
      line: 1,
      column: 11,
    },
    {
      description: 'Should reject custom properties that do not match a previous declaration',
      code: '.anchor { color: var(--test-color, #111); a { color: var(--test-color, #000); } }',
      message: messages.expected('--test-color', '#000'),
      line: 1,
      column: 11,
    },
  ],
});
