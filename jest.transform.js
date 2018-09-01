const babel = require('./babel.config');

module.exports = require('babel-jest').createTransformer(babel);
