module.exports = {
  '*': [
    'biome check --write --no-errors-on-unmatched', // Format, sort imports, lint, and apply safe fixes
    'git add -u',
  ],
};
