/**
 * @jest-environment node
 */
const stylelint = require('stylelint');
const path = require('path');

const config = {
  plugins: [
    path.resolve(__dirname, '..', '..', '..', 'src', 'rules', 'custom-property-name', 'custom-property-name'),
  ],
  rules: {
    'terra/custom-property-name': true,
  },
};

describe('custom-property-name', () => {
  it('does not error with a matching name', () => {
    const result = stylelint.lint({
      code: '.test { color: var(--test-color, #000) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with a matching name with hyphen', () => {
    const result = stylelint.lint({
      code: '.test { background-image: var(--test-background-image, #000) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does error with a mismatched name with hyphen', () => {
    const result = stylelint.lint({
      code: '.test { background-image: var(--test-icon, #000) }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does error with a mismatched name', () => {
    const result = stylelint.lint({
      code: '.test { color: var(--test-color-primary, #000) }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });
});
