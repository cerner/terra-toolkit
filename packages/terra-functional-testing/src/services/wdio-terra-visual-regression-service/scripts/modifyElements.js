export default function modifyElements(elements, style, value) {
  function setProperty(element) {
    try {
      element.style.setProperty(style, value, 'important');
    } catch (error) {
      // eslint-disable-next-line prefer-template
      element.setAttribute('style', element.style.cssText + style + ':' + value + '!important;');
    }
  }

  function isElement(o) {
    return o instanceof HTMLElement && o !== null && o.nodeType === 1;
  }

  for (let i = 0; i < elements.length; i += 1) {
    if (!isElement(elements[i])) {
      for (let j = 0; j < elements[i].length; j += 1) {
        setProperty(elements[i][j]);
      }
    } else {
      setProperty(elements[i]);
    }
  }
}
