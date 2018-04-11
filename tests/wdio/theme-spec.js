/* global browser, describe, beforeEach, Terra */
describe('themeEachCustomProperty', () => {
  beforeEach(() => browser.url('/theme.html'));

  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '50px',
  });

  Terra.should.themeEachCustomProperty(
    '.test',
    {
      '--color': 'red',
      '--font-size': '50px',
    },
  );
});


/* global browser, describe, beforeEach, Terra */
describe('themeCombinationOfCustomProperties', () => {
  beforeEach(() => browser.url('/theme.html'));

  Terra.should.themeCombinationOfCustomProperties({
    testName: 'themed',
    properties: {
      '--color': 'blue',
      '--font-size': '50px',
    },
  });

  Terra.should.themeCombinationOfCustomProperties({
    testName: 'custom',
    selector: '.test',
    properties: {
      '--color': 'green',
      '--font-size': '50px',
    },
  });
});
