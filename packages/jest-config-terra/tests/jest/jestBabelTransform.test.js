const babelJest = require('babel-jest');

describe('babel transformer', () => {
  it('check if the ', () => {
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
