import { TERRA_VIEWPORTS } from '../../../static-assets/viewports';
/**
 * Determines the Terra form factor to for the current viewport size.
 *
 * @param {Number} viewpointWidth - Current width of the viewpoint.
 * @returns {String} - Terra form factor the current viewport with falls under.
 */
export default function getTerraFormFactor(viewpointWidth) {
  // Default to enormous then check if the current viewport is a small form factor
  let formFactor = 'enormous';

  const viewportSizes = Object.keys(TERRA_VIEWPORTS);
  for (let form = 0; form < viewportSizes.length; form += 1) {
    const viewportName = viewportSizes[form];
    if (viewpointWidth <= TERRA_VIEWPORTS[viewportName].width) {
      formFactor = viewportName;
      break;
    }
  }

  return formFactor;
}
