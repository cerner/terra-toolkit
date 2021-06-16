/**
 * Gets the viewport size of the current browser window.
 * @return {Object} - viewport width and height of the current browser window.
 */
const getViewportSize = () => {
  global.browser.execute(() => {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return { width, height };
  });
};

module.exports = getViewportSize;
