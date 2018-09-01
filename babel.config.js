const isEnv = env => process.env.NODE_ENV === env;

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: ['last 2 versions', 'ie >= 11'],
        },
        modules: isEnv('test') ? 'auto' : false,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: isEnv('production') ? true : false,
        useBuiltIns: true,
      },
    ],
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-external-helpers',
    [
      '@babel/plugin-proposal-class-properties',
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
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
  ],
};
