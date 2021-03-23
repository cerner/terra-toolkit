const translations = require('../../src/translationsMock');

describe('translations mock', () => {
  it('echos back the requested id from the default export', () => {
    const id = 'translations-id';
    expect(translations.default[id]).toEqual(id);
  });

  it('echos back the requested id from the messages export', () => {
    const id = 'translations-id';
    expect(translations.messages[id]).toEqual(id);
  });
});
