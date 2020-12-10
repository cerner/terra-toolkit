/**
 * @jest-environment node
 */
const stylelint = require('stylelint');
const path = require('path');

const config = {
  plugins: [
    path.resolve(__dirname, '..', '..', '..', 'src', 'rules', 'custom-property-pseudo-selectors', 'custom-property-pseudo-selectors'),
  ],
  rules: {
    'terra/custom-property-pseudo-selectors': true,
  },
};

describe('custom-property-pseudo-selectors', () => {
  it('does not error with a longer prefix before the pseudo selector', () => {
    const result = stylelint.lint({
      code: '.test:hover { color: var(--test-example-hover-color) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with a single pseudo selector', () => {
    const result = stylelint.lint({
      code: '.test:focus { color: var(--test-focus-color) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with a double pseudo selector', () => {
    const result = stylelint.lint({
      code: '.test:focus:hover { color: var(--test-focus-hover-color) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with a compound pseudo selector', () => {
    const result = stylelint.lint({
      code: '.one:focus.two:hover { color: var(--test-focus-hover-color) }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with two nested pseudo selectors', () => {
    const result = stylelint.lint({
      code: '.one:focus { .two:hover { color: var(--test-one-focus-two-hover-color) } }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does not error with three nested pseudo selectors', () => {
    const result = stylelint.lint({
      code: '.one:focus { .two:hover, .three:hover { color: var(--test-one-focus-two-hover-color) } }',
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does error with a custom properties that does not include the pseudo selector', () => {
    const result = stylelint.lint({
      code: '.test:hover { color: var(--test-color) }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does error with a custom properties that does not include the ancestor pseudo selectors', () => {
    const result = stylelint.lint({
      code: '.test:hover { color: var(--test-color) }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does error with a custom properties that declares pseudo selectors in the wrong order', () => {
    const result = stylelint.lint({
      code: '.one:hover { .two:focus { color: var(--test-focus-hover-color) } }',
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });
});
