module.exports = {
  'packages/**/*.{js,ts}': [
    'pnpm run fix:eslint',
    'pnpm run format:ts',
    'git add -u',
  ],
  '*.md': ['pnpm run format:md', 'git add -u'],
  '*.yaml': ['pnpm run format:yaml', 'git add -u'],
};
