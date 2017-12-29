const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const filesize = require('rollup-plugin-filesize');

const env = process.env.NODE_ENV;
const name = process.env.npm_package_name;

const config = {
  name,
  ouput: {
    name,
    sourcemap: true,
    globals: {
      react: 'React',
      redux: 'redux',
      'react-redux': 'react-redux',
    },
  },
  external: ['react', 'redux', 'react-redux'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    globals(),
    builtins(),
    json(),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      preferBuiltins: true,
      modulesOnly: true,
    }),
    commonjs({
      ignoreGlobal: true,
      exclude: ['packages/**'],
    }),
    babel({
      exclude: ['node_modules/**'],
      babelrc: true,
    }),
    filesize(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        dead_code: true,
        warnings: false,
        drop_debugger: true,
      },
    })
  );
}

module.exports = config;
