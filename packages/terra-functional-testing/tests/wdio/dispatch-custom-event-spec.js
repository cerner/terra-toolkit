/* global $ */
describe('dispatchCustomEvent', () => {
  before(() => {
    browser.url('/dispatch-custom-event.html');

    /* Setup event listener that injects a string into a paragraph. */
    browser.execute(() => {
      const eventListenerHandler = (event) => {
        const paragraph = document.getElementById('custom-event-paragraph');
        const { metaData } = event;
        const { injectedString } = metaData;
        paragraph.textContent = injectedString;
      };

      window.addEventListener('mockCustomEvent', eventListenerHandler);
    });
  });

  it('sends a custom event that injects a string into a paragraph', () => {
    const injectedString = 'mock';
    Terra.dispatchCustomEvent({
      name: 'mockCustomEvent',
      metaData: { injectedString },
    });
    console.log(`custom-event-paragraph: ${JSON.stringify($('#custom-event-paragraph'))}`);
    const actualString = $('#custom-event-paragraph').getText();
    expect(actualString).toEqual(injectedString);
  });
});
