/* global $ */
const dispatchCustomEvent = require('../../src/commands/utils/dispatchCustomEvent');

describe('dispatchCustomEvent', () => {
  it('sends an custom event that injects a string into a paragraph', () => {
    browser.url('/dispatch-custom-event.html');

    /* Setup event listener that injects a string into a paragraph. */
    browser.execute(() => {
      const eventListenerHandler = (event) => {
        const paragraph = document.getElementById('custom-event-paragraph');
        const { metaData } = event;
        const { customString } = metaData;
        paragraph.textContent = customString;
      };

      window.addEventListener('testCustomEvent', eventListenerHandler);
    });

    const customString = 'inject string via custom event';
    dispatchCustomEvent('testCustomEvent', { customString });
    const actualString = $('#custom-event-paragraph').getText();
    expect(actualString).toEqual(customString);
  });
});
