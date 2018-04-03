module.exports = {
  'demo/**/*.js': ['npm run fix:eslint', 'npm run format:js', 'git add'],
  'packages/**/*.js': ['npm run fix:eslint', 'npm run format:js', 'git add'],
  'packages/**/*.js': ['flow focus-check'],
  'packages/**/*.ts': ['npm run format:ts', 'git add'],
  '*.md': ['npm run format:md', 'git add'],
};
