module.exports = {
  'demo/**/*.js': ['npm run fix:eslint', 'npm run format', 'git add'],
  'packages/**/*.js': ['npm run fix:eslint', 'npm run format', 'git add'],
  'packages/**/*.js': ['flow focus-check'],
  'packages/**/*.ts': ['npm run format', 'git add'],
  '*.md': ['npm run format', 'git add'],
};
