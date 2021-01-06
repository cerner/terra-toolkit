const dispatchCustomEvent = (name, metaData) => {
  try {
    global.browser.execute((eventName, eventMetaData) => {
      /* If IE support is removed, convert below to use event constructors. */
      const event = document.createEvent('Event');
      event.initEvent(eventName, true, true);
      event.metaData = eventMetaData;
      window.dispatchEvent(event);
    }, name, metaData);
  } catch (error) {
    throw new Error(error);
  }
};

export default dispatchCustomEvent;
