/**
 * Script to retrieve the userAgent sent by the browser.
 *
 * @return {string} userAgent
 */
function getUserAgent() {
  return window.navigator.userAgent;
}

module.exports = getUserAgent;
