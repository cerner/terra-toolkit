const {
  cleanScreenshots,
  describeTests,
  describeViewports,
  dispatchCustomEvent,
  eventEmitter,
  getViewports,
  getViewportSize,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
  setViewportSize,
  ScreenshotRequestor,
} = require('../../../../src/commands/utils');

describe('index', () => {
  it('should export functions', () => {
    expect(cleanScreenshots).toBeDefined();
    expect(describeTests).toBeDefined();
    expect(describeViewports).toBeDefined();
    expect(dispatchCustomEvent).toBeDefined();
    expect(eventEmitter).toBeDefined();
    expect(getViewports).toBeDefined();
    expect(getViewportSize).toBeDefined();
    expect(hideInputCaret).toBeDefined();
    expect(setApplicationLocale).toBeDefined();
    expect(setViewport).toBeDefined();
    expect(setViewportSize).toBeDefined();
    expect(ScreenshotRequestor).toBeDefined();
  });
});
