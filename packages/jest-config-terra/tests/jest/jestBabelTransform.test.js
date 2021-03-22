const babelJest = require('babel-jest');

describe('babel transformer', () => {
  it('ensures the transformer is created with the correct configuration', () => {
    const customTransformer = 'customTransformer';
    jest.spyOn(babelJest, 'createTransformer').mockImplementation(() => customTransformer);
    // eslint-disable-next-line global-require
    const transformer = require('../../src/jestBabelTransform');

    expect(babelJest.createTransformer).toHaveBeenCalledWith({
      rootMode: 'upward-optional',
    });
    expect(transformer).toEqual(customTransformer);
    babelJest.createTransformer.mockReset;
  });
});
