export default {
  '*': [
    'oxlint --fix', // Lint and apply safe fixes
    'oxfmt --write', // Format and sort imports
  ],
};
