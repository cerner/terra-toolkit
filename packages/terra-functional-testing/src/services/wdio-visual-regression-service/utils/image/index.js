const { Logger } = require('@cerner/terra-cli');
const which = require('which');
const { ...jimp } = require('./jimp');
const { ...gm } = require('./gm');

const logger = new Logger({ prefix: '[wdio-visual-regression-service:image]' });

let gmInstalled = false;

try {
  gmInstalled = !!which.sync('gm');
} catch (e) {
  // do nothing
}

logger.verbose(`Use image processing library: ${gmInstalled ? 'GraphicsMagick' : 'Jimp'}`);

const { cropImage, mergeImages, scaleImage } = gmInstalled ? gm : jimp;
module.exports = { cropImage, scaleImage, mergeImages };
