const { describeViewports } = require('../../../../src/commands/utils');

describe('describeViewports', () => {
  it('should describe viewport', () => {
    const mockBefore = jest.fn();
    const mockDescribe = jest.fn();
    const mockAfter = jest.fn();

    global.before = mockBefore;
    global.describe = mockDescribe;
    global.after = mockAfter;

    global.Terra = {
      serviceOptions: {
        formFactor: 'tiny',
      },
    };

    describeViewports('viewport', ['tiny', 'large'], () => {});

    expect(global.describe).toHaveBeenCalled();
  });
});
