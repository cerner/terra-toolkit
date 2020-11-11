import getTerraFormFactor from '../../../../../src/services/wdio-visual-regression-service/modules/getTerraFormFactor';

describe('getTerraFormFactor', () => {
  it.each([
    [400, 'tiny'],
    [500, 'small'],
    [700, 'medium'],
    [900, 'large'],
    [1200, 'huge'],
    [1500, 'enormous'],
    [3000, 'enormous'],
  ])('when viewpoint width is %d, returns %s', (viewpointWidth, expectedFormFactor) => {
    const result = getTerraFormFactor(viewpointWidth);
    expect(result).toEqual(expectedFormFactor);
  });
});
