module.exports = {
  '*.{js,ts,tsx}': [
    'biome check --write --no-errors-on-unmatched', // Format, sort imports, lint, and apply safe fixes
    'git add -u',
  ],
  '*.md': ['pnpm run format:md', 'git add -u'],
  '*.yaml': ['pnpm run format:yaml', 'git add -u'],
};
