describe('themeEachCustomProperty', () => {
  before(() => browser.url('/theme.html'));

  Terra.should.matchScreenshot('before');

  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '50px',
  });

  Terra.should.matchScreenshot('verify-styles were removed');

  Terra.should.themeEachCustomProperty(
    '.test',
    {
      '--color': 'red',
      '--font-size': '50px',
    },
  );
});


describe('themeCombinationOfCustomProperties', () => {
  before(() => browser.url('/theme.html'));

  Terra.should.matchScreenshot('before');

  Terra.should.themeCombinationOfCustomProperties({
    properties: {
      '--color': 'blue',
      '--font-size': '50px',
    },
  });

  Terra.should.matchScreenshot('verify-styles were removed');

  Terra.should.themeCombinationOfCustomProperties({
    testName: 'custom',
    selector: '.test',
    properties: {
      '--color': 'green',
      '--font-size': '50px',
    },
  });
});
