const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const bundleSize = require('rollup-plugin-bundle-size');

const env = process.env.NODE_ENV;
const version = process.env.npm_package_version;

const config = {
  entry: 'modules/index.js',
  moduleName: '@flopflip-launchdarkly-wrapper',
  sourceMap: true,
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }], 'stage-0', 'react'],
      plugins: ['external-helpers'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    resolve({
      module: true,
    }),
    bundleSize(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = config;
