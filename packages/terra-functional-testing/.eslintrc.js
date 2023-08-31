module.exports = {
  extends: '@cerner/terra',
  root: true,
  parserOptions: {
    requireConfigFile: false,
  },
  overrides: [
    {
      files: [
        './tests/mocha/services/wdio-visual-regression-service/**/*.js',
      ],
      env: {
        mocha: true,
        node: true,
      },
      rules: {
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'space-before-function-paren': 'off',
      },
    },
  ],
};
