const path = require('path');
const { dynamicRequire } = require('../../../config/configUtils');

describe('dynamicRequire', () => {
  it('returns undefined when invalid', () => {
    const file = dynamicRequire('./invalidPath');
    expect(file).toBe(undefined);
  });

  it('returns file when valid', () => {
    const file = dynamicRequire(path.resolve(__dirname, '../../../package.json'));
    expect(file).toHaveProperty('name', 'terra-toolkit');
  });
});
