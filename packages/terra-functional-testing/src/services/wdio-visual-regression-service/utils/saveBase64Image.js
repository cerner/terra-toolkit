const fsExtra = require('fs-extra');

async function saveBase64Image(filePath, base64Screenshot) {
  return fsExtra.outputFile(filePath, base64Screenshot, 'base64');
}

module.exports = saveBase64Image;
