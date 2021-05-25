const { getViewports } = require('../../../../src/commands/utils');
const { TERRA_VIEWPORTS } = require('../../../../src/constants');

const {
  tiny,
  small,
  medium,
  large,
  huge,
  enormous,
} = TERRA_VIEWPORTS;

describe('getViewports', () => {
  it('should get all viewports', () => {
    const viewports = getViewports();

    expect(viewports[0]).toEqual({ ...tiny, name: 'tiny' });
    expect(viewports[1]).toEqual({ ...small, name: 'small' });
    expect(viewports[2]).toEqual({ ...medium, name: 'medium' });
    expect(viewports[3]).toEqual({ ...large, name: 'large' });
    expect(viewports[4]).toEqual({ ...huge, name: 'huge' });
    expect(viewports[5]).toEqual({ ...enormous, name: 'enormous' });
  });

  it('should get specified viewport', () => {
    const viewports = getViewports('tiny');

    expect(viewports.length).toEqual(1);
    expect(viewports[0]).toEqual({ ...tiny, name: 'tiny' });
  });
});
