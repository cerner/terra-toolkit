/**
 * trigger window.resize to re-layout js components
 */
export default function triggerResize() {
  const evt = window.document.createEvent('UIEvents');
  evt.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(evt);
}
