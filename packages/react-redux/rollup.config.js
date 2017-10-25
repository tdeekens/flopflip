const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const builtins = require('rollup-plugin-node-builtins');
const filesize = require('rollup-plugin-filesize');

const env = process.env.NODE_ENV;
const version = process.env.npm_package_version;

const config = {
  input: 'modules/index.js',
  name: '@flopflip-react-redux',
  sourcemap: true,
  external: ['react', 'prop-types', 'redux', 'react-redux'],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
    redux: 'redux',
    'react-redux': 'react-redux',
  },
  plugins: [
    commonjs(),
    resolve({
      module: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    builtins(),
    filesize(),
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
