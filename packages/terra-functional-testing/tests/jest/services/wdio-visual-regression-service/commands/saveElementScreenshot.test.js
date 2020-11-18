import saveElementScreenshot from '../../../../../src/services/wdio-visual-regression-service/commands/saveElementScreenshot';
import makeElementScreenshot from '../../../../../src/services/wdio-visual-regression-service/modules/makeElementScreenshot';
import saveBase64Image from '../../../../../src/services/wdio-visual-regression-service/utils/saveBase64Image';

jest.mock('../../../../../src/services/wdio-visual-regression-service/modules/makeElementScreenshot');
jest.mock('../../../../../src/services/wdio-visual-regression-service/utils/saveBase64Image');

describe('saveElementScreenshot', () => {
  const mockBrowser = {};
  const mockSelector = '.element';
  const mockBase64String = 'base64String';

  beforeEach(() => {
    makeElementScreenshot.mockResolvedValue(mockBase64String);
  });

  afterEach(() => {
    makeElementScreenshot.mockReset();
  });

  it('throws error when called without elementSelector', async () => {
    const expectedErrorText = /Please pass a valid selector value to parameter elementSelector/;
    expect(saveElementScreenshot.call(mockBrowser)).rejects.toThrow(expectedErrorText);
  });

  it('throws error when called with invalid elementSelector', async () => {
    const expectedErrorText = /Please pass a valid selector value to parameter elementSelector/;

    expect(saveElementScreenshot.call(mockBrowser, {})).rejects.toThrow(expectedErrorText);
    expect(saveElementScreenshot.call(mockBrowser, null)).rejects.toThrow(expectedErrorText);
    expect(saveElementScreenshot.call(mockBrowser, 1)).rejects.toThrow(expectedErrorText);
  });

  it('works correctly when called with elementSelector only', async () => {
    const base64String = await saveElementScreenshot.call(mockBrowser, mockSelector);
    expect(base64String).toEqual(mockBase64String);

    expect(makeElementScreenshot).toHaveBeenCalledTimes(1);
    expect(makeElementScreenshot).toHaveBeenCalledWith(mockBrowser, mockSelector, undefined);
    expect(saveBase64Image).not.toHaveBeenCalled();
  });

  it('works correctly when called with elementSelector, options', async () => {
    const options = { hide: ['.random'] };

    const base64String = await saveElementScreenshot.call(mockBrowser, mockSelector, options);
    expect(base64String).toEqual(mockBase64String);

    expect(makeElementScreenshot).toHaveBeenCalledTimes(1);
    expect(makeElementScreenshot).toHaveBeenCalledWith(mockBrowser, mockSelector, options);
    expect(saveBase64Image).not.toHaveBeenCalled();
  });

  it('works correctly when called with fileName, elementSelector, options', async () => {
    const fileName = 'mytest.png';
    const options = { hide: ['.random'] };

    const base64String = await saveElementScreenshot.call(mockBrowser, fileName, mockSelector, options);
    expect(base64String).toEqual(mockBase64String);

    expect(makeElementScreenshot).toHaveBeenCalledTimes(1);
    expect(makeElementScreenshot).toHaveBeenCalledWith(mockBrowser, mockSelector, options);
    expect(saveBase64Image).toHaveBeenCalledTimes(1);
    expect(saveBase64Image).toHaveBeenCalledWith(fileName, base64String);
  });
});
