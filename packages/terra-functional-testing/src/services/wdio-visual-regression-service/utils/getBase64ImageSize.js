const sizeOf = require('image-size');

function getBase64ImageSize(base64Screenshot) {
  const buffer = new Buffer.from(base64Screenshot, 'base64'); // eslint-disable-line new-cap
  const size = sizeOf(buffer);
  return size;
}

module.exports = getBase64ImageSize;
