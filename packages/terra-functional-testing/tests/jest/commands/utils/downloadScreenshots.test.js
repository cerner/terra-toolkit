const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const { downloadScreenshots } = require('../../../../src/commands/utils');

describe('downloadScreenshots', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not download screenshot when no url provided', async () => {
    jest.spyOn(https, 'get').mockImplementationOnce(() => { });

    await downloadScreenshots();

    expect(https.get).not.toHaveBeenCalled();
  });

  it('should download screenshot with url', async () => {
    const url = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip';
    await downloadScreenshots(url);

    const zipPath = path.join(process.cwd(), 'terra-wdio-screenshots');

    expect(fs.existsSync(zipPath)).toBeTruthy();

    fs.removeSync(path.join(process.cwd(), 'terra-wdio-screenshots'));
  });
});
