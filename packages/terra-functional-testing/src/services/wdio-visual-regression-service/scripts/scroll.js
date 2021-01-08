/**
 * Script to scroll to a particular set of coordinates in the document.
 *
 * @param {Number} x - The pixel along the horizontal axis of the document.
 * @param {Number} y - The pixel along the vertical axis of the document.
 * @returns {undefined}
 */
function scroll(x, y) {
  window.scrollTo(x, y);
}

module.exports = scroll;
