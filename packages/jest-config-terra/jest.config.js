module.exports = {
  // Set a custom testEnvironment to allow us to compartmentalize setup.
  testEnvironment: '@cerner/jest-config-terra/lib/jest-environment-jsdom-terra.js',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'tests/jest/reports/coverage',
  collectCoverageFrom: [
    '**/src/**/*.js(x)?',
  ],
  coveragePathIgnorePatterns: [
    '/src/terra-dev-site',
  ],
  coverageReporters: [
    'html',
    'text',
    'lcov',
    'cobertura',
    'text-summary',
  ],
  testMatch: [
    '**/jest/**/(*.)(spec|test).js?(x)',
  ],
  // moduleDirectories: [ // Do we need this?
  //   'packages',
  //   'node_modules',
  // ],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy', // TODO do we need to add more file extensions here?
    // These replace the various translations imports with mocked versions.
    '^de\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
    '^en(-AU|-CA|-GB|-US)?\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
    '^es(-ES|-US)?\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
    '^fr(-FR)?\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
    '^nl(-BE)?\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
    '^pt(-BR)?\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
    '^sv(-SE)?\\.js$': '@cerner/jest-config-terra/lib/translationsMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': '@cerner/jest-config-terra/lib/jestBabelTransform',
  },
};
