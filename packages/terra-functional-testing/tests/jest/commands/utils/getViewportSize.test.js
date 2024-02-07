const { getViewportSize } = require('../../../../src/commands/utils');

describe('getViewportSize', () => {
  it('should get the current viewport size', async () => {
    const mockExecute = jest.fn().mockReturnValue({ screenWidth: 1000, screenHeight: 768 });
    global.browser = {
      execute: mockExecute,
    };

    const viewportSize = await getViewportSize();

    expect(mockExecute).toHaveBeenCalled();
    expect(viewportSize.width).toEqual(1000);
    expect(viewportSize.height).toEqual(768);
  });
});
