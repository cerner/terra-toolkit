/**
 * Reads the userAgent sent by your browser.
 * @return {string} userAgent
 */
export default function getUserAgent() {
  return window.navigator.userAgent;
}
