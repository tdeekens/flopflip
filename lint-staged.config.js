module.exports = {
  'demo/**/*.js': ['npm run fix:eslint', 'npm run format:ts', 'git add -u'],
  'packages/**/*.{js,ts}': [
    'npm run fix:eslint',
    'npm run format:ts',
    'git add -u',
  ],
  '*.md': ['npm run format:md', 'git add -u'],
  '*.yaml': ['npm run format:yaml', 'git add -u'],
};
