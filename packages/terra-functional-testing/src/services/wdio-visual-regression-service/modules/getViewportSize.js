/**
 * Returns the current viewport size
 */
// eslint-disable-next-line
export default async function getViewportSize() {
  // eslint-disable-next-line
  const res = await browser.execute(function() {
    return {
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  });
  return {
    width: res.screenWidth,
    height: res.screenHeight,
  };
}
