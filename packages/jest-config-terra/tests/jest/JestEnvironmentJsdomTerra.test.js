const JestEnvironmentJsdomTerra = require('../../src/JestEnvironmentJsdomTerra');

describe('jest environment jsdom terra', () => {
  it('sets up the environment appropriately', () => {
    const testConfig = {
      globals: {},
      testEnvironmentOptions: {},
    };

    const environment = new JestEnvironmentJsdomTerra(testConfig, {});
    expect(environment.dom.window.matchMedia).toBeDefined();
    expect(environment.dom.window.HTMLElement.prototype.scrollIntoView).toBeDefined();
    const htmlTag = environment.dom.window.document.getElementsByTagName('html')[0];
    expect(htmlTag.getAttribute('dir')).toEqual('ltr');
  });
});
