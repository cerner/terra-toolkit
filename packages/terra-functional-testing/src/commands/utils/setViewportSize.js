const getViewportSize = require('./getViewportSize');

const MAX_RETRIES = 5;

async function setViewportSize(viewport, retryNo = 0) {
  const { width, height } = viewport;
  const windowSize = await global.browser.getWindowSize();
  const viewportSize = await getViewportSize();

  const widthDiff = windowSize.width - viewportSize.width;
  const heightDiff = windowSize.height - viewportSize.height;

  // change window size with indent
  await global.browser.setWindowSize(width + widthDiff, height + heightDiff);

  const newViewportSize = await getViewportSize();

  // if viewport size is not equal to the desired size, execute process again
  if (retryNo < MAX_RETRIES && (newViewportSize.width !== width || newViewportSize.height !== height)) {
    await setViewportSize(viewport, retryNo + 1);
  }
}

module.exports = setViewportSize;
