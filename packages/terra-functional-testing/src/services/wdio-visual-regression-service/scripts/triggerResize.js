/**
 * Script to trigger a window resize event to re-layout js components.
 *
 * @returns {undefined}
 */
function triggerResize() {
  const event = window.document.createEvent('UIEvents');
  event.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(event);
}

module.exports = triggerResize;
