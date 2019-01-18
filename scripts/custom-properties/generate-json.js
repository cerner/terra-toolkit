const fs = require('fs');
const commander = require('commander');
const collectCustomProperties = require('./collect-custom-properties');

// Parse process arguments
commander
  .option('-f, --files [files]', 'Glob path to search for SCSS files', 'src/**/*.scss')
  .parse(process.argv);

const customProperties = {};

collectCustomProperties(commander.files).forEach((cssValue) => {
  // eslint-disable-next-line prefer-destructuring
  customProperties[cssValue[0]] = cssValue[1];
});

// Write results to theme-properties.json file
fs.writeFile('./theme-properties.json', JSON.stringify(customProperties, null, 2), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('JSON saved to ./theme-properties.json');
  }
});
