const path = require('path');
const { config } = require('@cerner/terra-unit-testing');

module.exports = {
  ...config,
  collectCoverageFrom: [
    '**/config/**/*.js',
    '**/config/**/*.jx',
    '**/scripts/**/*.js',
    '**/scripts/**/*.js',
    '**/src/**/*.js',
    '**/src/**/*.jsx',
    '!**/src/**/terra-dev-site/**/*.js',
    '!**/src/**/terra-dev-site/**/*.jsx',
  ],
  globalSetup: path.join(__dirname, 'jest.globalSetup.js'),
  setupFiles: [
    'raf/polyfill',
    path.join(__dirname, 'jest.setup.js'),
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  moduleNameMapper: {
    '\\.(svg|jpg|png|md)$': path.join(__dirname, 'fileMock.js'),
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  moduleDirectories: [
    'aggregated-translations',
    'node_modules',
  ],
  rootDir: process.cwd(),
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': path.join(__dirname, 'jest.babelTransform.js'),
  },
};
