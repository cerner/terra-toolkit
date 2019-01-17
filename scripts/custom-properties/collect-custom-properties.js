const fs = require('fs');
const glob = require('glob');

// Store values as we iterate
const customProperties = [];

// Create an array of all the *.module.SCSS files and loop through it
glob.sync('packages/terra-*/src/**/*.module.scss').forEach((file) => {
  // Read the file, convert to string and then split each line
  const scssFile = fs.readFileSync(file).toString().split('\n');

  // Loop through each line
  scssFile.forEach((line) => {
    // const cssValue = line.split(':')[1]; // doesnt work with inline Base64 svg files
    /*
    Write tests showing how this parses the following
    "var(--terra-table-row-selected-background-color, darken(#ebf6fd, 2%))",
    "calc(100% - 2 * var(--terra-abstract-modal-horizontal-inset, 10px))",
    "calc(var(--terra-grid-gutter-margin-left, 1rem) * -1)",
    "var(--terra-abstract-modal-overlay-background-color, rgba(0, 0, 0, 0.4))",
    "var(--terra-alert-title-display)",
    "var(--terra-alert-title-float, left)",
    */

    // Get everything after : character
    const cssValueRgx = /:(.*)\)/;

    // Pattern to check for terra theme variable
    const cssCustomPropertyRgx = /var\(\s*(--terra.*)(.*)\)/;

    // Check if CSS value exists as we parse every line in SCSS file, not just CSS declarations
    if (cssValueRgx.exec(line) !== null) {
      const cssValue = cssValueRgx.exec(line)[0]; // full string of characters matched

      // Check if cssValue contains terra theme variable
      if (cssCustomPropertyRgx.exec(cssValue) !== null) {
        // Trim first 2 chars and last char from string
        let trimmedCssValue = cssValue.substring(2).slice(0, -1);

        // If value includes calc, trim it down
        if (trimmedCssValue.includes('calc')) {
          // eslint-disable-next-line prefer-destructuring
          trimmedCssValue = trimmedCssValue.split(')')[0];
        }

        // Remove everything from var( to beginning of string
        // eslint-disable-next-line prefer-destructuring
        trimmedCssValue = trimmedCssValue.split('var(')[1];

        // Split property and value into an array
        const cleanedCssValue = trimmedCssValue.split(/,(.+)/);

        // If theme variable has no defined value
        if (cleanedCssValue[1] === undefined) {
          customProperties.push([cleanedCssValue[0], 'No defined value']);
        } else {
          customProperties.push([cleanedCssValue[0], cleanedCssValue[1].trim()]); // trim leading whitespace
        }
      }
    }
  });
});

module.exports = customProperties;
