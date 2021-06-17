const { setViewportSize, getViewportSize } = require('../../../../src/commands/utils');

const mockSetWindowSize = jest.fn();
const mockGetWindowSize = jest.fn().mockReturnValue({ width: 1010, height: 778 });

jest.mock('../../../../src/commands/utils/getViewportSize', () => {
  const mockGetViewportSize = jest.fn(() => (
    { width: 910, height: 760 }
  ));

  return mockGetViewportSize;
});

global.browser = {
  setWindowSize: mockSetWindowSize,
  getWindowSize: mockGetWindowSize,
};

describe('setViewportSize', () => {
  it('should set specified viewport size', () => {
    setViewportSize({ width: 1000, height: 768 }, 5);

    expect(getViewportSize).toHaveBeenCalledTimes(2);
    expect(mockSetWindowSize).toHaveBeenCalled();
    expect(mockGetWindowSize).toHaveBeenCalled();
  });
});
