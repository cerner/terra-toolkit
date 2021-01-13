/**
 * @jest-environment node
 */
const stylelint = require('stylelint');
const path = require('path');

const config = {
  plugins: [
    path.resolve(__dirname, '..', '..', '..', 'src', 'rules', 'custom-property-namespace', 'custom-property-namespace'),
  ],
  rules: {
    'terra/custom-property-namespace': true,
  },
};

const configCustomNamespace = {
  plugins: [
    path.resolve(__dirname, '..', '..', '..', 'src', 'rules', 'custom-property-namespace', 'custom-property-namespace'),
  ],
  rules: {
    'terra/custom-property-namespace': [
      true,
      {
        namespace: 'mock-namespace',
      }],
  },
};

describe('custom-property-namespace', () => {
  it('does not error with a default namespace', () => {
    const result = stylelint.lint({
      files: [
        path.resolve(__dirname, 'pass.css'),
      ],
      config,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does error with no default namespace', () => {
    const result = stylelint.lint({
      files: [
        path.resolve(__dirname, 'fail.css'),
      ],
      config,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });

  it('does not error with a custom namespace', () => {
    const result = stylelint.lint({
      code: '.test { color: var(--mock-namespace-color) }',
      config: configCustomNamespace,
    });

    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('does error with no custom namespace', () => {
    const result = stylelint.lint({
      code: '.test { color: var(--test-color) }',
      config: configCustomNamespace,
    });

    return result.then(data => {
      expect(data.errored).toBeTruthy();
      expect(data.results[0].warnings).toMatchSnapshot();
    });
  });
});
