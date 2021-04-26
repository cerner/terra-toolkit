const { dispatchCustomEvent } = require('../../src/commands/utils');

describe('dispatchCustomEvent', () => {
  it('sends a custom event that injects a string into a paragraph', () => {
    browser.url('/dispatch-custom-event.html');

    /* Setup event listener that injects a string into a paragraph. */
    // eslint-disable-next-line prefer-arrow-callback
    browser.execute(function addParagraphEventListener() {
      const eventListenerHandler = (event) => {
        const paragraph = document.getElementById('custom-event-paragraph');
        const { metaData } = event;
        const { injectedString } = metaData;
        paragraph.textContent = injectedString;
      };

      window.addEventListener('mockCustomEvent', eventListenerHandler);
    });

    const injectedString = 'mock';
    dispatchCustomEvent({
      name: 'mockCustomEvent',
      metaData: { injectedString },
    });
    const actualString = $('#custom-event-paragraph').getText();
    expect(actualString).toEqual(injectedString);
  });
});
