import path from 'path';
import fsExtra from 'fs-extra';
import { assert } from 'chai';

import { cropImage } from '../../../../../../../src/services/wdio-visual-regression-service/utils/image';
import CropDimension from '../../../../../../../src/services/wdio-visual-regression-service/utils/CropDimension';
import saveBase64Image from '../../../../../../../src/services/wdio-visual-regression-service/utils/saveBase64Image';

import compareImages from '../../../helper/compareImages';

const tmpPath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'tmp');
const imagePath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'fixtures', 'images');

const imageBase = path.join(imagePath, 'base', '200x100.png');

const imageCropped = path.join(imagePath, 'cropped', 'cropped-image.png');
const imageRotated = path.join(imagePath, 'cropped', 'rotated-image.png');
const imageGravityNorthWest = path.join(imagePath, 'cropped', 'gravity-northwest-image.png');
const imageGravitySouthWest = path.join(imagePath, 'cropped', 'gravity-southwest-image.png');

async function readAsBase64(file) {
  // read binary data
  const content = await fsExtra.readFile(file);
  // convert binary data to base64 encoded string
  return new Buffer(content).toString('base64'); // eslint-disable-line no-buffer-constructor
}

describe('cropImage', function() {
  it('throws error when invalid crop dimensions are provided', async function() {
    try {
      await cropImage('', {});
    } catch (err) {
      assert.match(err.message, /Please provide a valid instance of CropDimension!/);
    }
  });

  it('crops image', async function() {
    // given
    const base64ImageInput = await readAsBase64(imageBase);
    const cropDimension = new CropDimension(120, 80, 10, 10, true, 0);
    const imageTest = path.join(tmpPath, 'cropped-image-test.png');

    // when
    const base64ImageOutput = await cropImage(base64ImageInput, cropDimension);
    await saveBase64Image(imageTest, base64ImageOutput);

    // then
    await compareImages(imageTest, imageCropped);
  });

  it('crops image with rotation', async function() {
    // given
    const base64ImageInput = await readAsBase64(imageBase);
    const cropDimension = new CropDimension(100, 120, 0, 0, true, 90);
    const imageTest = path.join(tmpPath, 'rotated-image-test.png');

    // when
    const base64ImageOutput = await cropImage(base64ImageInput, cropDimension);
    await saveBase64Image(imageTest, base64ImageOutput);

    // then
    await compareImages(imageTest, imageRotated);
  });

  it('crops image with gravity "NorthWest"', async function() {
    // given
    const base64ImageInput = await readAsBase64(imageBase);
    const cropDimension = new CropDimension(120, 80, 5, 5, true, 0);
    const imageTest = path.join(tmpPath, 'gravity-northwest-image-test.png');

    // when
    const base64ImageOutput = await cropImage(base64ImageInput, cropDimension);
    await saveBase64Image(imageTest, base64ImageOutput);

    // then
    await compareImages(imageTest, imageGravityNorthWest);
  });

  it('crops image with gravity "SouthWest"', async function() {
    // given
    const base64ImageInput = await readAsBase64(imageBase);
    const cropDimension = new CropDimension(120, 80, 5, 5, false, 0);
    const imageTest = path.join(tmpPath, 'gravity-southwest-image-test.png');

    // when
    const base64ImageOutput = await cropImage(base64ImageInput, cropDimension);
    await saveBase64Image(imageTest, base64ImageOutput);

    // then
    await compareImages(imageTest, imageGravitySouthWest);
  });
});
