/**
 * @jest-environment node
 */
const stylelint = require('stylelint');
const path = require('path');

const config = {
  plugins: [
    path.resolve(__dirname, '..', '..', '..', 'src', 'rules', 'custom-property-no-duplicate-declaration', 'custom-property-no-duplicate-declaration'),
  ],
  rules: {
    'terra/custom-property-no-duplicate-declaration': true,
  },
};

describe('custom-property-no-duplicate-declaration', () => {
  it('does not error with a one custom property', () => {
    const result = stylelint.lint({
      code: 'a { color: var(--test-color, #000); }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with two distinct custom properties', () => {
    const result = stylelint.lint({
      code: 'a { color: var(--test-color, #000); } .anchor { color: var(--test-color, #000); }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does error with sibling duplicate custom properties', () => {
    const result = stylelint.lint({
      code: 'a { color: var(--test-color, #000); } .anchor { color: var(--test-color, #111); }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does error with reversed sibling duplicate custom properties', () => {
    const result = stylelint.lint({
      code: '.anchor { color: var(--test-color, #111); } a { color: var(--test-color, #000); }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does error with nested duplicate custom properties', () => {
    const result = stylelint.lint({
      code: '.anchor { color: var(--test-color, #111); a { color: var(--test-color, #000); } }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });
});
