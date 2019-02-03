module.exports = {
  'demo/**/*.js': ['npm run fix:eslint', 'npm run format', 'git add -u'],
  'packages/**/*.js': [
    'npm run fix:eslint',
    'pretty-quick --staged',
    'npm run format',
    'git add -u',
  ],
  'packages/**/*.ts': ['pretty-quick --staged', 'npm run format', 'git add -u'],
  '*.md': ['npm run format:md', 'git add -u'],
  '*.yaml': ['npm run format:yaml', 'git add -u'],
};
