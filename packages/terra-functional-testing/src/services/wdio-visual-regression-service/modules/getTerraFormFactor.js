import terraViewports from '../../../utils/viewports';

/**
 * Determines the Terra form factor to for the current viewport size.
 * @returns {String} Terra form factor the current viewport with falls under
 */
// eslint-disable-next-line
export default async function getTerraFormFactor () {
  // eslint-disable-next-line
  const browserWidth = await browser.execute(function() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  });

  // Default to enormous then check if the current viewport is a small form factor
  let formFactor = 'enormous';

  const viewportSizes = Object.keys(terraViewports);
  for (let form = 0; form < viewportSizes.length; form += 1) {
    const viewportName = viewportSizes[form];
    if (browserWidth <= terraViewports[viewportName].width) {
      formFactor = viewportName;
      break;
    }
  }

  return formFactor;
}
