export default {
  '*': [
    'oxlint --fix --no-error-on-unmatched-pattern', // Lint and apply safe fixes; allow non-lintable files (e.g. .md, .json)
    'oxfmt --write --no-error-on-unmatched-pattern', // Format and sort imports
  ],
};
