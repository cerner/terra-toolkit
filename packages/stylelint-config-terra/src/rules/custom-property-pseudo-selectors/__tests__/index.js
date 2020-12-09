const testRule = require('stylelint-test-rule-tape');
const { rule, ruleName, messages } = require('../custom-property-pseudo-selectors.js');

testRule(rule, {
  ruleName,
  config: true,
  skipBasicChecks: true,

  accept: [
    { code: '.test:hover { color: var(--test-example-hover-color) }' },
    { code: '.test:focus { color: var(--test-focus-color) }' },
    { code: '.test:focus:hover { color: var(--test-focus-hover-color) }' },
    { code: '.one:focus.two:hover { color: var(--test-focus-hover-color) }' },
    { code: '.one:focus { .two:hover { color: var(--test-one-focus-two-hover-color) } }' },
    { code: '.one:focus { .two:hover, .three:hover { color: var(--test-one-focus-two-hover-color) } }' },
  ],

  reject: [
    {
      description: 'Should reject custom properties that do not include the pseudo selector',
      code: '.test:hover { color: var(--test-color) }',
      message: messages.expected('--test-color', ['hover']),
      line: 1,
      column: 15,
    },
    {
      description: 'Should reject custom properties that do not include the anscestor pseudo selectors',
      code: '.test:hover { color: var(--test-color) }',
      message: messages.expected('--test-color', ['hover']),
      line: 1,
      column: 15,
    },
    {
      description: 'Should reject custom properties that declare pseudo selectors in the wrong order',
      code: '.one:hover { .two:focus { color: var(--test-focus-hover-color) } }',
      message: messages.expected('--test-focus-hover-color', ['hover', 'focus']),
      line: 1,
      column: 27,
    },
  ],
});
