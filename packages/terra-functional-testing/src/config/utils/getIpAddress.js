const ip = require('ip');
const os = require('os');

module.exports = () => {
  const utun = Object.entries(os.networkInterfaces()).filter(([key]) => key.includes(('utun'))).flat();

  if (utun && utun.length > 0) {
    let IPv4;
    utun.forEach((utunItem) => {
      if (Array.isArray(utunItem)) {
        IPv4 = utunItem.filter((networkItem) => networkItem.family === 'IPv4');
      }
    });
    return (IPv4) ? IPv4[0].address : ip.address();
  }

  return ip.address();
};
