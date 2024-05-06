describe('jest environment jsdom terra', () => {
  it('sets up the environment appropriately', () => {
    expect(window.matchMedia()).toEqual({ matches: true });
    expect(window.HTMLElement.prototype.scrollIntoView).toBeDefined();

    const htmlTag = window.document.getElementsByTagName('html')[0];
    expect(htmlTag.getAttribute('dir')).toEqual('ltr');
  });
});
