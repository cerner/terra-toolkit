// This script can be used to alphabetize files for better readability

/* eslint-disable consistent-return */
/* eslint-disable array-callback-return  */
/* eslint-disable no-restricted-syntax  */
/* eslint-disable no-console */

const fs = require('fs');

if (process.argv.length === 2) {
  console.error('Expected at least one argument!');
  process.exit(1);
}

const fileToUpdate = process.argv[2] || 'Default';


if(!fs.existsSync(fileToUpdate)){
  console.error('Error: file does not exist');
  process.exit(1);
}

const fileContent = fs.readFileSync(fileToUpdate, 'utf-8');
const lines = fileContent.split('\n');

// alphabetize the file
lines.sort(Intl.Collator().compare);

const linesToWrite = lines.join('\n') + '\n';

const disclaimerMessage = `This file is the result of updating:\n${allFiles.join('\n')}.\nComments are combined together at the top of the file.\n\nYou may need to review it to make sure the comments and values are correct.\n\n-------------------\n\n\n`;

const outputFile = `${fileToUpdate}_alphabetized`;
fs.writeFileSync(outputFile, disclaimerMessage);
fs.appendFileSync(outputFile, linesToWrite);

process.exit(0);
