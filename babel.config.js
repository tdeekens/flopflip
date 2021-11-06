const isEnv = (env) => process.env.NODE_ENV === env;

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
        ...(isEnv('test')
          ? {
              targets: {
                browsers: ['last 1 versions'],
                node: '8',
              },
              modules: 'commonjs',
            }
          : {
              targets: {
                browsers: ['last 2 versions', 'ie >= 11'],
              },
              modules: false,
              useBuiltIns: 'entry',
              include: ['transform-classes'],
            }),
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
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-private-methods',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-private-property-in-object',
      {
        loose: true,
      },
    ],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
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
