const ip = require('ip');
const os = require('os');

module.exports = () => {
  const utun = Object.entries(os.networkInterfaces()).find(([key]) => key.includes(('utun3')));
  if (utun && utun.length > 0) {
    let ipv4;
    utun.forEach((utunItem) => {
      if (Array.isArray(utunItem)) {
        ipv4 = utunItem.filter((networkItem) => networkItem.family === 'IPv4');
      }
    });
    return ipv4[0].address;
  }

  return ip.address();
};
