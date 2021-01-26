import getTerraFormFactor from '../../../../../src/services/wdio-visual-regression-service/modules/getTerraFormFactor';

describe('getTerraFormFactor', () => {
  it('should return the small viewport', () => {
    const size = {
      screenWidth: 622,
      screenHeight: 768,
    };

    global.browser = {
      execute: () => size,
    };

    const result = getTerraFormFactor();

    expect(result).toEqual('small');
  });

  it('should return huge as the default viewport size', () => {
    const size = {
      screenWidth: 3000,
      screenHeight: 768,
    };

    global.browser = {
      execute: () => size,
    };

    const result = getTerraFormFactor();

    expect(result).toEqual('enormous');
  });
});
