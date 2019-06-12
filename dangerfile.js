// eslint-disable-next-line import/no-extraneous-dependencies
import { danger, fail } from 'danger';

const hasCHANGELOGChanges = danger.git.modified_files.some((filePath) => {
  const srcFilePattern = /CHANGELOG.md/i;
  return srcFilePattern.test(filePath);
});

const hasModifiedFiles = danger.git.modified_files.some((filePath) => {
  const filePattern = /(src|scripts|config)/;
  return !filePath.includes('md') && filePattern.test(filePath);
});

if (hasModifiedFiles && !hasCHANGELOGChanges) {
  fail('Please include a CHANGELOG entry with this PR.');
}
