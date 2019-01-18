const fs = require('fs');
const retext = require('retext');
const spell = require('retext-spell');
const enUSDictionary = require('dictionary-en-us');
const report = require('vfile-reporter');
const commander = require('commander');

const collectCustomProperties = require('./collect-custom-properties');

// Parse process arguments
commander
  .option('-f, --files [files]', 'Glob path to search for SCSS files', 'src/**/*.scss')
  .option('-d, --dictionary [dictionary]', 'Path to custom dictionary for spell check')
  .parse(process.argv);

const customPropertiesSet = new Set();

/**
 * Loop through words used in custom properties and add unique ones to a set
 */
collectCustomProperties(commander.files).forEach((cssValue) => {
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
      personal: (commander.dictionary ? fs.readFileSync(commander.dictionary).toString() : ''),
    })
    .process(word, (err, files) => {
      if (report(err || files) !== 'no issues found') {
        console.error(report(err || files));
        process.exit(1);
      }
    });
});
