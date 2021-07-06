import getTerraFormFactor from '../../../../../src/services/wdio-visual-regression-service/modules/getTerraFormFactor';

describe('getTerraFormFactor', () => {
  it('should return the small viewport', () => {
    const size = {
      width: 622,
      height: 768,
    };

    global.browser = {
      getWindowSize: jest.fn().mockReturnValue(size),
    };

    const result = getTerraFormFactor();

    expect(result).toEqual('small');
  });

  it('should return huge as the default viewport size', () => {
    const size = {
      width: 3000,
      height: 768,
    };

    global.browser = {
      getWindowSize: jest.fn().mockReturnValue(size),
    };

    const result = getTerraFormFactor();

    expect(result).toEqual('enormous');
  });
});
