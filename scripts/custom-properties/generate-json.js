const fs = require('fs');
const customPropertiesCollection = require('./collect-custom-properties');

const customProperties = {};

customPropertiesCollection.forEach((cssValue) => {
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
