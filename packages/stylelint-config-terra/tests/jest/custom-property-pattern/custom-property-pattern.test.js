/**
 * @jest-environment node
 */
const stylelint = require('stylelint');
const path = require('path');

const config = {
  plugins: [
    path.resolve(__dirname, '..', '..', '..', 'src', 'rules', 'custom-property-pattern', 'custom-property-pattern'),
  ],
  rules: {
    'terra/custom-property-pattern': true,
  },
};

describe('custom-property-pattern', () => {
  it('does not error with a custom property', () => {
    const result = stylelint.lint({
      code: '.test { color: var(--test-example-color) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with another custom property', () => {
    const result = stylelint.lint({
      code: '.test { background-color: var(--test-background-color) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does error with custom property with underscores', () => {
    const result = stylelint.lint({
      code: '.test { background-color: var(--test_color) }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does error with custom property with uppercase characters', () => {
    const result = stylelint.lint({
      code: '.test { color: var(--Test-color) }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });
});
