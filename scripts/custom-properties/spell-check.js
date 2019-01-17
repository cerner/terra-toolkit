const fs = require('fs');
const retext = require('retext');
const spell = require('retext-spell');
const enUSDictionary = require('dictionary-en-us');
const report = require('vfile-reporter');

const customPropertiesCollection = require('./collect-custom-properties');

const customPropertiesSet = new Set();

/**
 * Loop through words used in custom properties and add unique ones to a set
 */
customPropertiesCollection.forEach((cssValue) => {
  cssValue[0].replace('--terra', '').split('-').forEach((word) => {
    if (word !== '') {
      customPropertiesSet.add(word);
    }
  });
});

/**
 * Spell check words used in custom properties
 */
const customPropertyWords = Array.from(customPropertiesSet);
customPropertyWords.forEach((word) => {
  retext()
    .use(spell, {
      dictionary: enUSDictionary,
      personal: fs.readFileSync('./custom-properties-spell-check-dictionary.txt').toString(),
    })
    .process(word, (err, files) => {
      if (report(err || files) !== 'no issues found') {
        console.error(report(err || files));
        process.exit(1);
      }
    });
});
