const fs = require('fs');
const readPkgUp = require('read-pkg-up');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const { terser } = require('rollup-plugin-terser');
const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const flow = require('rollup-plugin-flow');
const filesize = require('rollup-plugin-filesize');
const babelOptions = require('./babel.config');
const { pkg } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const env = process.env.NODE_ENV;
const name = process.env.npm_package_name;
const format = process.env.npm_lifecycle_event.split(':')[1];

const pkgDependencies = Object.keys(pkg.dependencies || {});
const pkgPeerDependencies = Object.keys(pkg.peerDependencies || {});
const pkgOptionalDependencies = Object.keys(pkg.optionalDependencies || {});

/**
 * Note:
 *   Given we do not bundle for UMD
 *   then all dependencies are considered external as they
 *   will be "bundled" by the consumers bundler (e.g. webpack) or
 *   resolved by Node.js.
 */
const externalDependencies =
  format !== 'umd'
    ? pkgDependencies
        .concat(pkgPeerDependencies)
        .concat(pkgOptionalDependencies)
    : pkgPeerDependencies;

const config = {
  output: {
    name,
    sourcemap: true,
    globals: {
      react: 'React',
      redux: 'redux',
      'react-redux': 'react-redux',
    },
  },
  external: externalDependencies,
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
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
      ...babelOptions,
    }),
    commonjs({
      ignoreGlobal: true,
      exclude: ['packages/**'],
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType'],
      },
    }),
    flow({ all: true }),
    filesize(),
  ],
};

if (env === 'production') {
  config.plugins.push(terser());
}

module.exports = config;
