/**
 * Script to retrieve top, bottom, left, and right properties for the elements found
 * for the provided css selector.
 *
 * @param {string} selector - The css selector of the element(s) to receive information from.
 * @returns {Object[]} The list of top, bottom, left, and right properties for the found elements.
 */
export default function getBoundingRect(selector) {
  const elements = document.querySelectorAll(selector);

  return Array.prototype.map.call(elements, (elem) => {
    const boundingRect = elem.getBoundingClientRect();
    return {
      top: boundingRect.top,
      right: boundingRect.right,
      bottom: boundingRect.bottom,
      left: boundingRect.left,
    };
  });
}
