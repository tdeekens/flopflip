const { transform } = require('@babel/core');
const babelConfig = require('./babel.config');

module.exports = {
  process(src, filename, config) {
    return transform(src, { filename, ...babelConfig }) || src;
  },
};
