const jestConfig = require('@cerner/jest-config-terra');

module.exports = {
  ...jestConfig,
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
