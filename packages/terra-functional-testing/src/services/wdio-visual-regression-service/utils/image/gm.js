import gm from 'gm';
import fsExtra from 'fs-extra';
import path from 'path';
import uuidv4 from 'uuid/v4';

import CropDimension from '../CropDimension';

const tmpDir = path.join(__dirname, '../../../tmp');

/**
 * Crops an image.
 * @param {string} base64Screenshot - image to crop
 * @param {CropDimension} cropDimensions - dimensions
 * @return {Promise} resolves to cropped image
 */
export async function cropImage(base64Screenshot, cropDimensions) {
  if (!(cropDimensions instanceof CropDimension)) {
    throw new Error('Please provide a valid instance of CropDimension!');
  }

  const image = gm(new Buffer.from(base64Screenshot, 'base64')); // eslint-disable-line new-cap

  if (cropDimensions.getRotation() !== 0) {
    image.rotate('white', cropDimensions.getRotation());
  }

  image.gravity(cropDimensions.getGravity());
  image.crop(cropDimensions.getWidth(), cropDimensions.getHeight(), cropDimensions.getX(), cropDimensions.getY());

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line func-names, space-before-function-paren, prefer-arrow-callback
    image.toBuffer('PNG', function(err, buffer) {
      if (err) {
        return reject(err);
      }
      return resolve(buffer.toString('base64'));
    });
  });
}

/**
 * Scales an image down or up.
 * @param {string} base64Screenshot - image to scale
 * @param {Number} scaleFactor - scale factor, e.g. 0.5 for downscale or 1.5 for upscale
 * @return {Promise} resolves to cropped image
 */
export async function scaleImage(base64Screenshot, scaleFactor) {
  const image = gm(new Buffer.from(base64Screenshot, 'base64')); // eslint-disable-line new-cap

  const percent = scaleFactor * 100;
  image.filter('Box'); // to produce equal images as Jimp
  // image.filter('Sinc'); // works also but was slower in tests
  image.resize(percent, percent, '%');

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line func-names, space-before-function-paren, prefer-arrow-callback
    image.toBuffer('PNG', function(err, buffer) {
      if (err) {
        return reject(err);
      }
      return resolve(buffer.toString('base64'));
    });
  });
}

/**
 * Merges multidimensional array of images to a single image:
 * @param  {string[][]} images array of images
 * @return {string}        screenshot
 */
export async function mergeImages(images) {
  const uuid = uuidv4();
  const dir = path.join(tmpDir, uuid);

  try {
    await fsExtra.ensureDir(dir);

    // merge all horizontal screens
    const rowImagesPromises = images.map((colImages, key) => {
      const firstImage = colImages.shift();
      const rowImage = gm(firstImage);

      if (colImages.length) {
        colImages.push(true);
        rowImage.append.apply(rowImage, colImages); // eslint-disable-line prefer-spread
      }

      return new Promise((resolve, reject) => {
        const file = path.join(dir, `${key}.png`);
        // eslint-disable-next-line func-names, space-before-function-paren, prefer-arrow-callback
        rowImage.write(file, function(err) {
          if (err) {
            return reject(err);
          }
          return resolve(file);
        });
      });
    });

    // merge all vertical screens
    const base64Screenshot = await Promise.all(rowImagesPromises).then(rowImages => {
      const firstImage = rowImages.shift();
      const mergedImage = gm(firstImage);

      if (rowImages.length) {
        mergedImage.append.apply(mergedImage, rowImages); // eslint-disable-line prefer-spread
      }

      return new Promise((resolve, reject) => {
        // eslint-disable-next-line func-names, space-before-function-paren, prefer-arrow-callback
        mergedImage.toBuffer('PNG', function(err, buffer) {
          if (err) {
            return reject(err);
          }
          return resolve(buffer.toString('base64'));
        });
      });
    });

    await fsExtra.remove(dir);
    return base64Screenshot;
  } catch (e) {
    try {
      await fsExtra.remove(dir);
    } catch (error) {
      // do nothing
    }

    throw e;
  }
}
