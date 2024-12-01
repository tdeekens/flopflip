export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // Allow to write a "scope" with slashes
      // E.g. `refactor(app/my-component): something`
      headerPattern: /^(\w*)(?:\(([\w\$\.\/\-\* ]*)\))?\: (.*)$/,
    },
  },
  rules: {
    'header-max-length': [0, 'always', 100],
  },
};
