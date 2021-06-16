const {
  cleanScreenshots,
  describeTests,
  describeViewports,
  dispatchCustomEvent,
  downloadScreenshots,
  getViewports,
  getViewportSize,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
  setViewportSize,
} = require('../../../../src/commands/utils');

describe('index', () => {
  it('should export functions', () => {
    expect(cleanScreenshots).toBeDefined();
    expect(describeTests).toBeDefined();
    expect(describeViewports).toBeDefined();
    expect(dispatchCustomEvent).toBeDefined();
    expect(downloadScreenshots).toBeDefined();
    expect(getViewports).toBeDefined();
    expect(getViewportSize).toBeDefined();
    expect(hideInputCaret).toBeDefined();
    expect(setApplicationLocale).toBeDefined();
    expect(setViewport).toBeDefined();
    expect(setViewportSize).toBeDefined();
  });
});
