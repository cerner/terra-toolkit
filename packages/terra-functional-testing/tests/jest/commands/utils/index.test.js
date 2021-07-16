const {
  cleanScreenshots,
  describeTests,
  describeViewports,
  dispatchCustomEvent,
  downloadScreenshots,
  eventEmitter,
  getViewports,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
} = require('../../../../src/commands/utils');

describe('index', () => {
  it('should export functions', () => {
    expect(cleanScreenshots).toBeDefined();
    expect(describeTests).toBeDefined();
    expect(describeViewports).toBeDefined();
    expect(dispatchCustomEvent).toBeDefined();
    expect(downloadScreenshots).toBeDefined();
    expect(eventEmitter).toBeDefined();
    expect(getViewports).toBeDefined();
    expect(hideInputCaret).toBeDefined();
    expect(setApplicationLocale).toBeDefined();
    expect(setViewport).toBeDefined();
  });
});
