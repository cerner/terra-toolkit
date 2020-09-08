import logger from '@wdio/logger';
import which from 'which';
import * as jimp from './jimp';
import * as gm from './gm';

const log = logger('wdio-visual-regression-service:image');

let gmInstalled = false;

try {
  gmInstalled = !!which.sync('gm');
} catch (e) {
  // do nothing
}

log.debug(`Use image processing library: ${gmInstalled ? 'GraphicsMagick' : 'Jimp'}`);

const { cropImage, mergeImages, scaleImage } = gmInstalled ? gm : jimp;
export { cropImage, scaleImage, mergeImages };
