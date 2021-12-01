module.exports = {
  'demo/**/*.js': ['yarn run fix:eslint', 'yarn run format:ts', 'git add -u'],
  'packages/**/*.{js,ts}': [
    'yarn run fix:eslint',
    'yarn run format:ts',
    'git add -u',
  ],
  '*.md': ['yarn run format:md', 'git add -u'],
  '*.yaml': ['yarn run format:yaml', 'git add -u'],
};
