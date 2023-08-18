// This script can be used to merge and sort ._ignore files.
// To execute the script, from the directory the script
// is being run for, run: node <pathToScript>/mergeFiles.js <fileToMerge>

/* eslint-disable consistent-return */
/* eslint-disable array-callback-return  */
/* eslint-disable no-restricted-syntax  */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

if (process.argv.length === 2) {
  console.error('Expected at least one argument!');
  process.exit(1);
}

const fileToMerge = process.argv[2] || 'Default';

const allFiles = [];

const getAllFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getAllFilesRecursively(absolute);
    } else if (absolute.includes(fileToMerge) && !absolute.includes('node_modules') && !absolute.includes('_merged')) allFiles.push(absolute);
  }
};

getAllFilesRecursively('./');

let allLines = [];
let allComments = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  const comments = lines.filter((line) => {
    if (line[0] === '#') {
      return line;
    }
  });

  const filteredLines = lines.filter((line) => {
    if (line[0] !== '#') {
      return line;
    }
  });

  allComments = allComments.concat(comments);
  allLines = allLines.concat(filteredLines);
}

const filteredContent = [...new Set(allLines)];
filteredContent.sort(Intl.Collator().compare);

const filteredComments = [...new Set(allComments)];

const commentsToWrite = `${filteredComments.join('\n')}\n\n`;
const contentToWrite = `${filteredContent.join('\n')}\n`;

const outputFile = `${fileToMerge}_merged`;

const disclaimerMessage = `This file is the result of merging:\n${allFiles.join('\n')}.\nComments are combined together at the top of the file.\n\nYou may need to review it to make sure the comments and values are correct.\n\n-------------------\n\n\n`;

fs.writeFileSync(outputFile, disclaimerMessage);
fs.appendFileSync(outputFile, commentsToWrite);
fs.appendFileSync(outputFile, contentToWrite);

process.exit(0);
