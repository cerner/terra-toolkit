const { chrome, firefox, ie } = require('../capabilities');

/**
 * Determines the browser capabilities for the WebDriver session.
 * @param {array} browsers - An array of browser names to enable. (chrome, firefox, ie)
 * @param {boolean} isGridEnabled - Whether the WebDriver session is running against the remote selenium grid.
 * @returns {array} - An array of browser capabilities.
 */
const getCapabilities = (browsers, isGridEnabled) => {
  const capabilities = [];

  if (!browsers) {
    // Enable chrome as the default browser.
    capabilities.push(chrome);

    // Enable all supported grid browsers by default.
    if (isGridEnabled) {
      capabilities.push(firefox, ie);
    }
  } else {
    browsers.forEach((browser) => {
      if (browser === 'chrome') {
        capabilities.push(chrome);
      } else if (browser === 'firefox') {
        capabilities.push(firefox);
      } else if (browser === 'ie' && isGridEnabled) {
        capabilities.push(ie);
      }
    });
  }

  // Randomize the browser order.
  return capabilities.sort(() => 0.5 - Math.random());
};

module.exports = getCapabilities;

