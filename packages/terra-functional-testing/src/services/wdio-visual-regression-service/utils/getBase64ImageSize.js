import sizeOf from 'image-size';

/**
 * Helper to get the image dimensions.
 *
 * @param {String} base64Screenshot - The base64 string representing the image.
 * @returns {Object} The height and width dimensions of the image.
 */
export default function getBase64ImageSize(base64Screenshot) {
  const buffer = new Buffer.from(base64Screenshot, 'base64'); // eslint-disable-line new-cap
  const size = sizeOf(buffer);
  return size;
}
