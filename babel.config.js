const isEnv = (env) => process.env.NODE_ENV === env;

/**
 * @type {import('@babel/core').TransformOptions}
 */
const preset = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: isEnv('test'),
        useBuiltIns: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-external-helpers',
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {
        loose: true,
      },
    ],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-export-namespace-from',
    [
      '@babel/plugin-transform-object-rest-spread',
      {
        useBuiltIns: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-nullish-coalescing-operator',
    isEnv('test') && [
      '@babel/plugin-transform-regenerator',
      {
        async: false,
      },
    ],
    isEnv('test') && 'babel-plugin-transform-dynamic-import',
    isEnv('test') && '@babel/plugin-transform-modules-commonjs',
    'babel-plugin-lodash',
    './babel-plugin-package-version',
  ].filter(Boolean),
};

module.exports = preset;
