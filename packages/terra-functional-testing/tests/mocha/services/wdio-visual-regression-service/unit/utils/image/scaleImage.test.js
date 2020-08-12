import path from 'path';
import fsExtra from 'fs-extra';

import { scaleImage } from '../../../../../../../src/services/wdio-visual-regression-service/utils/image';
import saveBase64Image from '../../../../../../../src/services/wdio-visual-regression-service/utils/saveBase64Image';

import compareImages from '../../../helper/compareImages';

const tmpPath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'tmp');
const imagePath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'fixtures', 'images');

const imageBase = path.join(imagePath, 'base', 'base-image.png');
const imageScaledDown = path.join(imagePath, 'scaled', 'scaled-down-image.png');

const imageIphoneBase = path.join(imagePath, 'base', 'iOS_iPhone.png');
const imageIphoneScaledDown = path.join(imagePath, 'scaled', 'iOS_iPhone_scaled_down.png');

async function readAsBase64(file) {
  // read binary data
  const content = await fsExtra.readFile(file);
  // convert binary data to base64 encoded string
  return new Buffer(content).toString('base64'); // eslint-disable-line no-buffer-constructor
}

describe('scaleImage', function() {
  it('scales image down', async function() {
    // given
    const base64ImageInput = await readAsBase64(imageBase);
    const imageTest = path.join(tmpPath, 'scaled-down-image.png');

    // when
    const base64ImageOutput = await scaleImage(base64ImageInput, 0.5);
    await saveBase64Image(imageTest, base64ImageOutput);

    // then
    await compareImages(imageTest, imageScaledDown);
  });

  it('scales more complex image down', async function() {
    // given
    const base64ImageInput = await readAsBase64(imageIphoneBase);
    const imageTest = path.join(tmpPath, 'iOS_iPhone_scaled_down.png');

    // when
    const base64ImageOutput = await scaleImage(base64ImageInput, 0.5);
    await saveBase64Image(imageTest, base64ImageOutput);

    // then
    await compareImages(imageTest, imageIphoneScaledDown);
  });
});
