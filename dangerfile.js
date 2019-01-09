// eslint-disable-next-line import/no-extraneous-dependencies
import { danger, warn, fail } from 'danger';

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

// Warn when there is a big PR
const bigPRThreshold = 1000;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR. Consider breaking this into smaller PRs if applicable');
}
