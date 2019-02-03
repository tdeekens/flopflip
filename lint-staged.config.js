module.exports = {
  'demo/**/*.js': ['npm run fix:eslint', 'npm run format', 'git add'],
  'packages/**/*.js': [
    'npm run fix:eslint',
    'pretty-quick --staged',
    'npm run format',
    'git add',
  ],
  'packages/**/*.ts': ['pretty-quick --staged', 'npm run format', 'git add'],
  '*.md': ['npm run format:md', 'git add'],
  '*.yaml': ['npm run format:yaml', 'git add'],
};
