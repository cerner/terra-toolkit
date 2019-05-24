describe('themeEachCustomProperty', () => {
  before(() => browser.url('/theme.html'));

  Terra.it.matchesScreenshot('before');

  Terra.should.themeEachCustomProperty({
    '--color': 'red',
    '--font-size': '50px',
  });

  // verify-styles were removed
  Terra.it.matchesScreenshot('before');

  // verify custom naming
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

  Terra.it.matchesScreenshot('before');

  Terra.should.themeCombinationOfCustomProperties({
    properties: {
      '--color': 'blue',
      '--font-size': '50px',
    },
  });

  // verify-styles were removed
  Terra.it.matchesScreenshot('before');

  // verify custom naming
  Terra.should.themeCombinationOfCustomProperties({
    testName: 'custom',
    selector: '.test',
    properties: {
      '--color': 'green',
      '--font-size': '50px',
    },
  });
});
