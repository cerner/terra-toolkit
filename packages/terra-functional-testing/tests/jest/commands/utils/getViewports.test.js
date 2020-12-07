const getViewports = require('../../../../src/commands/utils/getViewports');
const { TERRA_VIEWPORTS } = require('../../../../src/constants');

describe('getViewports', () => {
  it('should get all viewports', () => {
    const viewports = getViewports();

    expect(viewports[0]).toEqual(TERRA_VIEWPORTS.tiny);
    expect(viewports[1]).toEqual(TERRA_VIEWPORTS.small);
    expect(viewports[2]).toEqual(TERRA_VIEWPORTS.medium);
    expect(viewports[3]).toEqual(TERRA_VIEWPORTS.large);
    expect(viewports[4]).toEqual(TERRA_VIEWPORTS.huge);
    expect(viewports[5]).toEqual(TERRA_VIEWPORTS.enormous);
  });

  it('should get specified viewport', () => {
    const viewports = getViewports('tiny');

    expect(viewports.length).toEqual(1);
    expect(viewports[0]).toEqual(TERRA_VIEWPORTS.tiny);
  });
});
