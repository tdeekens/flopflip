const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const builtins = require('rollup-plugin-node-builtins');
const filesize = require('rollup-plugin-filesize');
const analyzer = require('rollup-analyzer-plugin');

const env = process.env.NODE_ENV;
const version = process.env.npm_package_version;

const config = {
  input: 'modules/index.js',
  name: '@flopflip-react-broadcast',
  sourcemap: true,
  external: ['react', 'prop-types'],
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup', 'stage-0', 'react'],
      plugins: ['transform-react-remove-prop-types'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    resolve({
      module: true,
    }),
    builtins(),
    filesize(),
    analyzer(),
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
