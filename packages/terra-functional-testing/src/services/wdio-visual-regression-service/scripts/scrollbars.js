/**
 * Script to add or remove the scrollbars from the document.
 *
 * @param {Boolean} enabled - Whether or not the scrollbars should be visible.
 * @returns null
 */
export default function scrollbars(enabled) {
  if (enabled) {
    document.documentElement.style.overflow = '';
  } else {
    document.documentElement.style.overflow = 'hidden';
  }
}
